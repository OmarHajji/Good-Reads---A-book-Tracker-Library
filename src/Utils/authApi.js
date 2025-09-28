import axios from "axios";

const authApi = axios.create({
  baseURL: "https://www.googleapis.com",
});

// Attach bearer token from localStorage
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors with clear messages
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.error?.message || error.message;

    if (status === 401) {
      // Dispatch event for auth context to handle
      window.dispatchEvent(new CustomEvent("auth:401"));
      return Promise.reject(
        new Error("Session expired or missing token. Please sign in again.")
      );
    }

    if (status === 403) {
      if (/insufficient.*scope/i.test(msg)) {
        return Promise.reject(
          new Error(
            "Missing Google Books permission. Log out and sign in again to grant access."
          )
        );
      }
      if (
        /Access Not Configured|API has not been used|not enabled/i.test(msg)
      ) {
        return Promise.reject(
          new Error(
            "Google Books API not enabled for your project. Enable it in Google Cloud Console."
          )
        );
      }
    }

    return Promise.reject(error);
  }
);

// Book tracking helper functions
const BookTracker = {
  // Track book as read/viewed (only add to Currently Reading if not already there)
  trackBookView: async (volumeId, title = "", authors = []) => {
    try {
      // Add to "Currently reading" shelf (ID: 3) - not "Have read" (ID: 4)
      await AuthAPI.addVolume(3, volumeId);
      return { success: true };
    } catch (error) {
      console.warn(`Failed to track book view: ${error.message}`);
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.email || "unknown";
      const readingBooks = JSON.parse(
        localStorage.getItem(`currently_reading_${userId}`) || "[]"
      );

      const bookData = {
        id: volumeId,
        title,
        authors,
        startedAt: new Date().toISOString(),
        shelf: "currently-reading",
      };

      if (!readingBooks.some((book) => book.id === volumeId)) {
        readingBooks.push(bookData);
        localStorage.setItem(
          `currently_reading_${userId}`,
          JSON.stringify(readingBooks)
        );
      }

      return { success: true, fallback: true };
    }
  },

  // Track book as favorite
  trackFavorite: async (
    volumeId,
    title = "",
    authors = [],
    isFavorite = true
  ) => {
    try {
      if (isFavorite) {
        // Add to Favorites shelf (ID: 0)
        await AuthAPI.addVolume(0, volumeId);
      } else {
        // Remove from Favorites shelf
        await AuthAPI.removeVolume(0, volumeId);
      }
      return { success: true };
    } catch (error) {
      console.warn(`Failed to track favorite: ${error.message}`);
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.email || "unknown";
      const favorites = JSON.parse(
        localStorage.getItem(`favorites_${userId}`) || "[]"
      );

      if (isFavorite) {
        const bookData = {
          id: volumeId,
          title,
          authors,
          favoritedAt: new Date().toISOString(),
        };
        if (!favorites.some((book) => book.id === volumeId)) {
          favorites.push(bookData);
        }
      } else {
        const index = favorites.findIndex((book) => book.id === volumeId);
        if (index > -1) favorites.splice(index, 1);
      }

      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
      return { success: true, fallback: true };
    }
  },

  // Check if book is favorited
  checkFavorite: async (volumeId) => {
    try {
      const response = await AuthAPI.getShelfVolumes(0); // Favorites shelf
      const books = response.data?.items || [];
      return books.some((book) => book.id === volumeId);
    } catch (error) {
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.email || "unknown";
      const favorites = JSON.parse(
        localStorage.getItem(`favorites_${userId}`) || "[]"
      );
      return favorites.some((book) => book.id === volumeId);
    }
  },

  // Move book between shelves
  moveBookBetweenShelves: async (
    volumeId,
    fromShelfId,
    toShelfId,
    bookTitle = ""
  ) => {
    try {
      // Remove from source shelf
      if (fromShelfId) {
        await AuthAPI.removeVolume(fromShelfId, volumeId);
      }

      // Add to destination shelf
      await AuthAPI.addVolume(toShelfId, volumeId);

      return { success: true };
    } catch (error) {
      console.error(`Failed to move book: ${error.message}`);
      return { success: false, error: error.message };
    }
  },
};

// Main API exports
export const AuthAPI = {
  // User profile (verifies token too)
  profile: () => authApi.get("/oauth2/v2/userinfo"),

  // Verify scopes on the current token (useful for debugging)
  tokenInfo: (accessToken) =>
    axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${encodeURIComponent(
        accessToken
      )}`
    ),

  // My Library (requires https://www.googleapis.com/auth/books scope)
  getShelves: () => authApi.get("/books/v1/mylibrary/bookshelves"),
  getShelfVolumes: (shelfId, params = {}) =>
    authApi.get(`/books/v1/mylibrary/bookshelves/${shelfId}/volumes`, {
      params: { maxResults: 12, ...params },
    }),

  addVolume: (shelfId, volumeId) =>
    authApi.post(`/books/v1/mylibrary/bookshelves/${shelfId}/addVolume`, null, {
      params: { volumeId },
    }),
  removeVolume: (shelfId, volumeId) =>
    authApi.post(
      `/books/v1/mylibrary/bookshelves/${shelfId}/removeVolume`,
      null,
      { params: { volumeId } }
    ),
  moveVolume: (volumeId, fromShelf, toShelf) =>
    authApi.post(
      `/books/v1/mylibrary/bookshelves/${fromShelf}/moveVolume`,
      null,
      { params: { volumeId, destination: toShelf } }
    ),
  clearAllVolumes: (shelfId) =>
    authApi.post(`/books/v1/mylibrary/bookshelves/${shelfId}/clearVolumes`),

  // Public shelves (do not require auth)
  getPublicShelves: (userId) =>
    authApi.get(`/books/v1/users/${userId}/bookshelves`),
  getPublicShelf: (userId, shelfId) =>
    authApi.get(`/books/v1/users/${userId}/bookshelves/${shelfId}`),
  getPublicShelfVolumes: (userId, shelfId, params = {}) =>
    authApi.get(`/books/v1/users/${userId}/bookshelves/${shelfId}/volumes`, {
      params,
    }),

  // Book tracking functions
  ...BookTracker,
};

export default authApi;
