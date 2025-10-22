import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Resources from "./components/Resources";
import Calendar from "./components/Calendar";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
      <Footer />
    </>
  );
}
