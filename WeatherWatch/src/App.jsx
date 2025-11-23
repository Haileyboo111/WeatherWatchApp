import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './Navbar';
import Home from './Home';
import TripPlanner from './TripPlanner';
import Users from './Users';
import About from './About';
import CalendarWithMockData from './mockdata/CalendarWithMockData'; 
// will later be taken out 
import Forecast from './Forecast';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
	  <Route path="/forecast" element={<Forecast />} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about" element={<About />} />
          <Route path="/mockdata" element={<CalendarWithMockData />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
