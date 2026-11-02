
import { useState } from "react";
import api from "../api";
import "./JobCard.css";

function JobCard({ job, onJobUpdated, onJobDeleted }) {
  const [status, setStatus] = useState(job.status || "applied");
  const [notes, setNotes] = useState(job.notes || "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Update an existing job
  async function handleUpdate() {
    setLoading(true);
    setError("");

    try {
      const response = await api.put(`/jobs/${job.id}`, {
        status,
        notes,
      });

      onJobUpdated(response.data);
    } catch (err) {
      console.error(
        "Update job failed:",
        err.response?.data || err.message
      );

      const statusCode = err.response?.status;

      if (statusCode === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (statusCode === 404) {
        setError("This job could not be found. It may have been deleted.");
      } else if (statusCode === 422) {
        setError("Some information is invalid. Please check your input.");
      } else if (statusCode >= 500) {
        setError("Something went wrong on our server. Please try again.");
      } else {
        setError("Unable to complete your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Delete an existing job
  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete the job at ${job.company}?`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await api.delete(`/jobs/${job.id}`);
      onJobDeleted(job.id);
    } catch (err) {
      console.error(
        "Delete job failed:",
        err.response?.data || err.message
      );

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : JSON.stringify(detail ?? err.message)
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="job-card">

      {/* Job information */}
      <div className="job-card-header">
        <h2>{job.company}</h2>
        <p className="job-role">
          Role: {job.position || "Not specified"}
        </p>
      </div>

      <p className="job-current-status">
        Current status: {job.status || "Not specified"}
      </p>

      {/* Change status */}
      <div className="job-card-fields">

        <div className="job-field">
          <label htmlFor={`status-${job.id}`}>
            Change status
          </label>

          <select
            id={`status-${job.id}`}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={loading || deleting}
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Notes */}
        <div className="job-field">
          <label htmlFor={`notes-${job.id}`}>
            Notes
          </label>

          <input
            id={`notes-${job.id}`}
            type="text"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={loading || deleting}
            placeholder="Add notes..."
          />
        </div>

      </div>

      {/* Action buttons */}
      <div className="job-card-actions">

        <button
          className="save-button"
          type="button"
          onClick={handleUpdate}
          disabled={loading || deleting}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          className="delete-button"
          type="button"
          onClick={handleDelete}
          disabled={loading || deleting}
        >
          {deleting ? "Deleting..." : "Delete Job"}
        </button>

      </div>

      {/* Error message */}
      {error && (
        <p className="error-message" role="alert">
          ⚠️ {error}
        </p>
      )}

    </article>
  );
}

export default JobCard;
