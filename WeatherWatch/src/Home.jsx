import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function Home() {
      return (
    <>
        <h1>Welcome to Weather Watch!</h1>;

        <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
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

