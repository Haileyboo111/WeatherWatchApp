import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <h3 className="logo">Weather Watch</h3>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
                        Home
                    </NavLink>
                </li>
	        <li>
                    <NavLink to="/forecast" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        Forecast
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/trip-planner" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        Calendar
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/users" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        Users
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        About
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
