import { useEffect, useState } from "react";
import HealthBadge from "./components/HealthBadge";
import Header from "./components/Header";
import JobCard from "./components/JobCard";
import Login from "./components/login";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const token = localStorage.getItem("access_token");

    fetch("https://job-tracker-api-tk84.onrender.com/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      });
  }, [loggedIn]);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <Header />

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            company={job.company}
            role={job.role}
          />
        ))
      )}

      <HealthBadge />
    </div>
  );
}

export default App;