import HealthBadge from "./components/HealthBadge";
import Header from "./components/Header";
import JobCard from "./components/JobCard";

function App() {
  return (
    <div>
      <Header />

      <JobCard
        company="Microsoft"
        role="Software Engineer Intern"
      />

      <JobCard
        company="Google"
        role="Backend Engineer Intern"
      />
      <HealthBadge />
    </div>
  );
}

export default App;