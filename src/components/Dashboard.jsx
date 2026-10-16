
import { useEffect, useState } from "react";
import Header from "./Header";
import JobCard from "./JobCard";
import HealthBadge from "./HealthBadge";
import api from "../api";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const response = await api.get("/jobs");
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error("The API did not return a list of jobs.");
        }

        if (!cancelled) {
          setJobs(data);
        }
      } catch (error) {
        if (cancelled) return;

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          setError("Your session expired. Please log in again.");
        } else {
          setError(
            error.response?.data?.detail ||
              error.message ||
              "Could not load jobs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Header />

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? null : jobs.length === 0 ? (
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

export default Dashboard;
