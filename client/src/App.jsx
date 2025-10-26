import Welcome from "./pages/Welcome";
import ChatUI from "./pages/ChatUI";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/chat" element={<ChatUI />} />
      </Routes>
    </>
  );
}

export default App;
