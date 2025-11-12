import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Resources from "./components/Resources";
import Events from "./components/Events";
import Calendar from "./components/Calendar";
import CommunityDiscussions from "./components/Discussion";
import Create from "./components/Create";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ContactUs from "./components/Contact";
import Logout from "./components/Logout";
import { ToastProvider } from "./components/Toast";

export default function App() {
  return (
    <ToastProvider>
      <Header />
      <main id="content" className="app-content" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/discussion" element={<CommunityDiscussions />} />
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
      <Footer />
    </ToastProvider>
  );
}
