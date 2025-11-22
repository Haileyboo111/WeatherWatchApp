import rainyDay from './assets/rainy-day_3750491.png'

function Home() {
      return (
    <>
        <h1>Welcome to Weather Watch!</h1>

        <div>
          <img src={rainyDay} className="logo" alt="Rainy day logo" />
        </div>
      <div className="card">
        <p>
          Plan Smart. Travel Safe.
        </p>
      </div>
    </>
  );
}

export default Home;
