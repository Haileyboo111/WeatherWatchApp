import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './Navbar';
import Home from './Home';
import Forecast from './Forecast';
import Users from './Users';
import About from './About';
import CalendarWithMockData from './mockdata/CalendarWithMockData'; 
// will later be taken out 

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<About />} />
          <Route path="/mockdata" element={<CalendarWithMockData />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
