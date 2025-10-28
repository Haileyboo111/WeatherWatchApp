import React from "react";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <h3 className="logo">Weather Watch</h3>
            <ul className="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Forecast</a></li>
                <li><a href="#">Users</a></li>
                <li><a href="#">About</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;