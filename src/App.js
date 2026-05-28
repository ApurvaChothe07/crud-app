import logo from './logo.svg';
import './App.css';

import Home from './Components/Home';
import AllUsers from './Components/AllUsers';
import AddUser from './Components/AddUser';
import NavBar from './Components/Navbar'; 
import EditUser from './Components/EditUser';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/all" element={<AllUsers/>} />
      <Route path="/add" element={<AddUser/>} />
      <Route path="/edit/:id" element={<EditUser/>} />

      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
