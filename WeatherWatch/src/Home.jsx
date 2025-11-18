import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './Home.css';

function Home() {
  useEffect(() => {
    document.body.classList.add('home-background');
    return () => {
      document.body.classList.remove('home-background');
    };
  }, []);
  return (
    <>
      <div className="home-text">Weather Watch </div>
      <div className="home-slogan">
        <p>Plan Smart. Travel Safe.</p>
      </div>

    </>
  );
}



export default Home;


