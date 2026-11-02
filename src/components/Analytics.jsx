
import { useEffect, useState } from "react";
import api from "../api";
import "./Analytics.css";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <main className="analytics-page">
        <p className="analytics-message">Loading analytics...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="analytics-page">
        <p className="analytics-error" role="alert">{error}</p>
      </main>
    );
  }

  if (!data || data.total_applications === 0) {
    return (
      <main className="analytics-page">
        <div className="analytics-empty">
          <h1>Job Analytics</h1>
          <p>No applications yet. Add your first job!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="analytics-page">
      <div className="analytics-header">
        <h1>Job Analytics</h1>
        <p>Your application statistics at a glance.</p>
      </div>

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
    </main>
  );
}

export default Analytics;
