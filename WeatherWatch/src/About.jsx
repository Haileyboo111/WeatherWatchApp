function About() {
  return (
    <section className="page" style={{ textAlign: "center", marginTop: "100px", padding: "1rem" }}>
      <h2>Description</h2>
      <p style={{ maxWidth: "700px", margin: "1rem auto", lineHeight: "1.6" }}>
        Welcome to <strong>Weather Watch</strong>, your personal trip-focused weather planner! 
        Unlike traditional weather apps that only show current conditions, Weather Watch helps 
        you plan ahead by saving future travel dates and destinations along with forecast data. 
        You can organize multiple trips, track potential weather disruptions, and receive 
        real-time alerts for your travel regions. Whether you’re scheduling a vacation, an event, 
        or any time-sensitive plans, Weather Watch helps you stay prepared and confident, rain or shine.
      </p>

      <h2 style={{ marginTop: "3rem" }}>Collaborators</h2>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", lineHeight: "1.8" }}>
        <li>Lola Jones</li>
        <li>Hailey Gonzalez</li>
        <li>Clarissa Aguayo</li>
        <li>Breona Saffouri</li>
        <li>Isabella Cox</li>
      </ul>
    </section>
  );
}

export default About;

