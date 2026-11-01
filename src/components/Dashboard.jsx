
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "./Header";
import JobCard from "./JobCard";
import HealthBadge from "./HealthBadge";
import JobForm from "../jobform";
import api from "../api";

import "./Dashboard.css";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add a newly created job
  function handleJobCreated(newJob) {
    setJobs((previousJobs) => [...previousJobs, newJob]);
  }

  // Update an existing job
  function handleJobUpdated(updatedJob) {
    setJobs((previousJobs) =>
      previousJobs.map((job) =>
        job.id === updatedJob.id ? updatedJob : job
      )
    );
  }

  // Delete a job
  function handleJobDeleted(jobId) {
    setJobs((previousJobs) =>
      previousJobs.filter((job) => job.id !== jobId)
    );
  }

  // Fetch jobs when Dashboard loads
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
    <div className="dashboard">
      <Header />

      <div className="dashboard-header">
        <h1>My Jobs</h1>

        <Link to="/analytics" className="analytics-link">
          View Analytics
        </Link>
      </div>

      <JobForm onJobCreated={handleJobCreated} />

      {/* Error state */}
      {error && (
        <p className="dashboard-error" role="alert">
          {error}
        </p>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div aria-label="Loading jobs" aria-busy="true">
          {[1, 2, 3].map((item) => (
            <div className="skeleton-card" key={item}>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          ))}
        </div>
      ) : error ? null : jobs.length === 0 ? (

        /* Empty state */
        <div className="empty-state">
          <h2>No applications yet</h2>
          <p>
            Start tracking your job applications by adding
            your first job above.
          </p>
        </div>

      ) : (

        /* Display job cards */
        <div className="job-list">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onJobUpdated={handleJobUpdated}
              onJobDeleted={handleJobDeleted}
            />
          ))}
        </div>
      )}

      <HealthBadge />
    </div>
  );
}

export default Dashboard;
