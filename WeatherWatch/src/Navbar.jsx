import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useUnit, getUnitSymbol } from "./context/UnitContext";

function Navbar() {
    const { unit, toggleUnit } = useUnit();
    const nextUnit = unit === "celsius" ? "Fahrenheit" : "Celsius";

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
                    <NavLink to="/users" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        Users
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/forecast" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        Forecast
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/trip-planner" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        Trip Planner
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : undefined)}>
                        About
                    </NavLink>
                </li>
            </ul>
            <button
                type="button"
                className="unit-toggle"
                aria-label={`Switch to ${nextUnit}`}
                onClick={toggleUnit}
            >
                {getUnitSymbol(unit)} • {nextUnit}
            </button>
        </nav>
    );
}

export default Navbar;
