import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage/HomePage.jsx";
import SignIn from "./SignIn/SignIn.jsx";
import SignUp from "./SignUp/SignUp.jsx";
import UserFeed from "./Flashcard/Feed.jsx";
import FlashcardSetPage from "./Flashcard/FlashcardSetPage.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import ToastNotification from "./Components/ToastNotification.jsx";
import EditProfile from "./Flashcard/EditProfile.jsx";
import FlashcardPage from "./Flashcard/FlashcardPage.jsx";
import FlashcardCreatePage from "./Flashcard/AddFlashcard.jsx";

function App() {
  return (
    <Provider store={store}>
      <ToastNotification />  {/* Ensure it's here */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feed" element={<UserFeed />} />
          <Route path="/flashcard-sets/:folderId" element={<FlashcardSetPage />} />
          <Route path="/update-profile" element={<EditProfile />} />
          <Route path="/study-flashcard/:folderId/:flashcardSetId" element={<FlashcardPage />} />
          <Route path="/addflashcard/:folderId/:flashcardSetId" element={<FlashcardCreatePage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
