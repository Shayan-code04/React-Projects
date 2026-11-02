
import { useState } from "react";
import api from "./api";
import "./JobForm.css";

function JobForm({ onJobCreated }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/jobs/", {
        position: title,
        company: company,
      });

      onJobCreated(response.data);
      setTitle("");
      setCompany("");
    } catch (err) {
      console.error(
        "Create job failed:",
        err.response?.data || err.message
      );

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : JSON.stringify(
              detail || err.message || "Failed to create job"
            )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <h2>Add a Job</h2>

      <div className="job-form-fields">
        <div className="job-form-field">
          <label htmlFor="job-title">Job title</label>
          <input
            id="job-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter job title"
            required
            disabled={loading}
          />
        </div>

        <div className="job-form-field">
          <label htmlFor="job-company">Company</label>
          <input
            id="job-company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Enter company name"
            required
            disabled={loading}
          />
        </div>
      </div>

      <button
        className="add-job-button"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Job"}
      </button>

      {error && (
        <p className="job-form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default JobForm;
