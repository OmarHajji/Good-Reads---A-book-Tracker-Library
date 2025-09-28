import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import MainLayout from "./Components/Layouts/MainLayout";
import CategoriesPage from "./Components/Pages/CategoriesPage";
import LandingPage from "./Components/Pages/LandingPage";
import AboutPage from "./Components/Pages/AboutPage";
import ContactPage from "./Components/Pages/ContactPage";
import NotFoundPage from "./Components/Pages/NotFoundPage";
import BookDetails from "./Components/Pages/BookDetails";
import BookViewer from "./Components/Pages/BookViewer";
import AuthLayout from "./Components/Layouts/AuthLayout";
import Login from "./Components/Pages/Login";
import SignUp from "./Components/Pages/SignUp";
import Home from "./Components/Pages/Home";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Mybooks from "./Components/Pages/Mybooks";
import Community from "./Components/Pages/Community";
import Profile from "./Components/Pages/Profile";
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/book/:bookId",
        element: <BookDetails />,
      },
      { path: "/book/:bookId/read", element: <BookViewer /> }, // New route for book viewer

      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/Mybooks", element: <Mybooks /> },
          { path: "/community", element: <Community /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
    errorElement: <NotFoundPage />,
  },

  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
  // {
  //   path: "/unauthorized",
  //   element: <UnAuthorized />,
  // },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
