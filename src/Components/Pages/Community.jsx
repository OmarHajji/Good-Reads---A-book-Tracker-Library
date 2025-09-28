import React, { useState, useContext } from "react";
import Container from "../UI/Container";
import { AuthGoogleContext } from "../../Contexts/AuthGoogleContext";
import {
  IoSend,
  IoCall,
  IoVideocam,
  IoSearch,
  IoArrowBack,
} from "react-icons/io5";

function Community() {
  const { user } = useContext(AuthGoogleContext);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Mock friends data
  const [friends] = useState([
    {
      id: 1,
      name: "Elen Hunt",
      avatar: "/fake-prof.png",
      lastMessage: "Thank you very much. I'm glad...",
      time: "11:56",
      online: true,
      unread: false,
    },
    {
      id: 2,
      name: "Jakob Saris",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
      lastMessage: "You. Send me the book you about w...",
      time: "4m Ago",
      online: false,
      unread: false,
    },
    {
      id: 3,
      name: "Jeremy Zucker",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&auto=format",
      lastMessage: "You. Send me the book you about...",
      time: "4m Ago",
      online: false,
      unread: false,
    },
  ]);

  // Mock messages for selected friend
  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        type: "text",
        content: "Good question. How about just discussing it?",
        sender: "friend",
        time: "Today 11:55",
        images: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&auto=format",
        ],
      },
      {
        id: 2,
        type: "text",
        content: "Yes of course. Are there problems with your job?",
        sender: "friend",
        time: "Today 11:58",
      },
      {
        id: 3,
        type: "text",
        content: "Of course. Thank you so much for taking your time.",
        sender: "me",
        time: "Today 11:56",
      },
      {
        id: 4,
        type: "images",
        sender: "friend",
        time: "Today 11:55",
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=80&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=80&fit=crop&auto=format",
        ],
      },
      {
        id: 5,
        type: "text",
        content: "Morning Elen Hunt. I have a question about my job!",
        sender: "me",
        time: "Today 11:52",
      },
      {
        id: 6,
        type: "text",
        content:
          "What are the points that are important to get the perfect result of my assignment?",
        sender: "me",
        time: "Today 11:54",
      },
      {
        id: 7,
        type: "images",
        sender: "friend",
        time: "Today 11:55",
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=80&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&h=80&fit=crop&auto=format",
        ],
      },
    ],
  });

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setShowChat(true);
  };

  const handleBackToFriends = () => {
    setShowChat(false);
    setSelectedFriend(null);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedFriend) return;

    const newMsg = {
      id: Date.now(),
      type: "text",
      content: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMsg],
    }));

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Container className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="flex h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Friends Sidebar */}
        <div
          className={`${
            showChat ? "hidden" : "flex"
          } md:flex w-full md:w-80 border-r border-gray-200 flex-col`}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Friends
            </h2>

            {/* Search */}
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Friend's Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
              />
            </div>
          </div>

          {/* Friends List */}
          <div className="flex-1 overflow-y-auto">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => handleSelectFriend(friend)}
                className={`flex items-center p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedFriend?.id === friend.id
                    ? "bg-brown/10 border-r-2 border-brown"
                    : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  {friend.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {friend.name}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {friend.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
                    {friend.lastMessage}
                  </p>
                </div>

                {friend.unread && (
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${!showChat ? "hidden" : "flex"} md:flex flex-1 flex-col`}
        >
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={handleBackToFriends}
                    className="md:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-brown transition-colors"
                  >
                    <IoArrowBack className="w-5 h-5" />
                  </button>
                  <img
                    src={selectedFriend.avatar}
                    alt={selectedFriend.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <div className="ml-2 sm:ml-3">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {selectedFriend.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-green-600">Online</p>
                  </div>
                </div>

                <div className="flex space-x-2 sm:space-x-3">
                  <button className="p-1.5 sm:p-2 text-gray-500 hover:text-brown transition-colors">
                    <IoCall className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button className="p-1.5 sm:p-2 text-gray-500 hover:text-brown transition-colors">
                    <IoVideocam className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages[selectedFriend.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                        message.sender === "me"
                          ? "bg-brown text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.type === "text" && (
                        <p className="text-xs sm:text-sm">{message.content}</p>
                      )}

                      {message.images && (
                        <div className="grid grid-cols-2 gap-1 sm:gap-2 mt-2">
                          {message.images.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt=""
                              className="w-full h-16 sm:h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}

                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "me"
                            ? "text-brown-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <input
                    type="text"
                    placeholder="Type your message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brown focus:border-brown"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-brown text-white rounded-full hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <IoSend className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <IoSend className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Select a friend to start chatting
                </h3>
                <p className="text-sm text-gray-500">
                  Choose someone from your friends list to begin a conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Community;
