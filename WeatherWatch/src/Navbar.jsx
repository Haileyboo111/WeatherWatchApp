import React from "react";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <h3 className="logo">Weather Watch</h3>
            <ul className="nav-links">
                <li><a href="/" target="_blank" rel="noopener noreferrer">Home</a></li>
                <li><a href="/forecast" target="_blank" rel="noopener noreferrer">Forecast</a></li>
                <li><a href="/users" target="_blank" rel="noopener noreferrer">Users</a></li>
                <li><a href="/about" target="_blank" rel="noopener noreferrer">About</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;