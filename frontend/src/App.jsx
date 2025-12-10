
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Transactions from "./pages/Transactions.jsx";
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}
  


