import React from "react";
import './About.css';
import './Home.css';

function About() {
  return (
    <section>
      <img className="about-pic" alt="lightning" />
      <div className="about-title">Our Journey</div>
      <h2 className="about-h2">Who We Are</h2>
      <div className="about-form">
      <p>
        Welcome to <strong>Weather Watch</strong>, your personal trip-focused weather planner! 
        Unlike traditional weather apps that only show current conditions, Weather Watch helps 
        you plan ahead by saving future travel dates and destinations along with forecast data. 
        You can organize multiple trips, track potential weather disruptions, and receive 
        real-time alerts for your travel regions.
      </p>
      <p>
        Whether you’re scheduling a vacation, an event, 
        or any time-sensitive plans, Weather Watch helps you stay prepared and confident, rain or shine.
      </p>

      <hr className="about-hr"></hr>

      <div className="about-alignment">
        <span className="about-header box-container">Contact Us</span>
        <span className="about-text">
          <p><strong>Email: </strong></p>
          <p>weatherwatchask@gmail.com</p>
          <p><strong>Address: </strong></p>
          <span className="about-address">
            <p>1 N Grand Blvd, </p>
            <p>St. Louis, MO 63103</p>
          </span>
        </span>
      </div>

      <hr></hr>

      <div className="about-alignment"> 
        <ul className="about-list">
          <strong>
            <li>Lola Jones</li>
            <li>Hailey Gonzalez</li>
            <li>Clarissa Aguayo</li>
            <li>Breona Saffouri</li>
            <li>Isabella Cox</li>
          </strong>
        </ul>
        <h2 className="about-header box-container-right">Collaborators</h2>
      </div>
      </div>
    </section>
  );
}

export default About;

