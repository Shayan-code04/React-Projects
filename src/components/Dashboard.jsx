
import { useEffect, useState } from "react";
import Header from "./Header";
import JobCard from "./JobCard";
import HealthBadge from "./HealthBadge";
import JobForm from "../JobForm";
import api from "../api";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleJobCreated(newJob) {
    setJobs((previousJobs) => [...previousJobs, newJob]);
  }

  function handleJobUpdated(updatedJob) {
    setJobs((previousJobs) =>
      previousJobs.map((job) =>
        job.id === updatedJob.id ? updatedJob : job
      )
    );
  }

  function handleJobDeleted(jobId) {
    setJobs((previousJobs) =>
      previousJobs.filter((job) => job.id !== jobId)
    );
  }

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
          setError("");
        }
      } catch (err) {
        if (cancelled) return;

        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          setError("Your session expired. Please log in again.");
        } else {
          const detail = err.response?.data?.detail;

          setError(
            typeof detail === "string"
              ? detail
              : err.message || "Could not load jobs."
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
      <h1>My Jobs</h1>

      <JobForm onJobCreated={handleJobCreated} />

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? null : jobs.length === 0 ? (
        <p>No jobs found. Add your first job above!</p>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onJobUpdated={handleJobUpdated}
            onJobDeleted={handleJobDeleted}
          />
        ))
      )}

      <HealthBadge />
    </div>
  );
}

export default Dashboard;
