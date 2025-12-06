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
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> f38b87210b50c97178b4b3d41edae1679b57e244
=======
import { AuthProvider } from './context/AuthContext';
>>>>>>> main
=======
import { AuthProvider } from './context/AuthContext';
>>>>>>> caeb7bccc5378cdbf9a42ae0aeed8c4cebc1da8b

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
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
