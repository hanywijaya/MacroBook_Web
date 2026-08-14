import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/App.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddUser from "./pages/AddUser";
import AddMeal from "./pages/AddMeal";
import History from "./pages/History";

function App() {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/api/hello")
  //     .then((response) => response.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-meal" element={<AddMeal />} />
        <Route path="/history" element={<History />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;