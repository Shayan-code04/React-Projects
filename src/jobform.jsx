
import { useState } from "react";
import api from "./api";

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
    <form onSubmit={handleSubmit}>
      <h2>Add a Job</h2>

      <label>
        Job title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter job title"
          required
        />
      </label>

      <br />

      <label>
        Company
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Enter company name"
          required
        />
      </label>

      <br />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Job"}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export default JobForm;
