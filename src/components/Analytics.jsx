
import { useEffect, useState } from "react";
import api from "../api";
import "./Analytics.css";

function Analytics() {
  // Stores analytics received from FastAPI
  const [data, setData] = useState(null);

  // Tracks whether the API request is running
  const [loading, setLoading] = useState(true);

  // Stores an error message if the request fails
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/jobs/analytics");

        setData(response.data);
      } catch (err) {
        console.error("Analytics failed:", err);

        setError("Unable to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  // Loading state
  if (loading) {
    return <p>Loading analytics...</p>;
  }

  // Error state
  if (error) {
    return <p role="alert">{error}</p>;
  }

  // Empty state
  if (!data || data.total_applications === 0) {
    return <p>No applications yet. Add your first job!</p>;
  }

  return (
    <div>
      <h1>Job Analytics</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Applications</h3>
          <p>{data.total_applications}</p>
        </div>

        <div className="analytics-card">
          <h3>Applied</h3>
          <p>{data.by_status?.applied || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Interviewing</h3>
          <p>{data.by_status?.interviewing || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Offered</h3>
          <p>{data.by_status?.offered || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Rejected</h3>
          <p>{data.by_status?.rejected || 0}</p>
        </div>

        <div className="analytics-card">
          <h3>Interview Rate</h3>
          <p>{data.interview_rate}%</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
