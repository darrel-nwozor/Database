import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import StudentData from "./StudentData";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <BrowserRouter>
        <Navbar />
        <div className="pt-4 px-4 md:px-6 lg:px-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<StudentData />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}



export default App;
