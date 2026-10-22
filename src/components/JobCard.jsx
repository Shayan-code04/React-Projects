
import { useState } from "react";
import api from "../api";

function JobCard({ job, onJobUpdated, onJobDeleted }) {
  const [status, setStatus] = useState(job.status || "applied");
  const [notes, setNotes] = useState(job.notes || "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

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

      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : JSON.stringify(detail ?? err.message)
      );
    } finally {
      setLoading(false);
    }
  }

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
    <article>
      <h2>{job.company}</h2>
      <p>Role: {job.position || "Not specified"}</p>
      <p>Current status: {job.status || "Not specified"}</p>

      <label>
        Change status:
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          disabled={loading || deleting}
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
        </select>
      </label>

      <br />

      <label>
        Notes:
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={loading || deleting}
        />
      </label>

      <br />

      <button
        type="button"
        onClick={handleUpdate}
        disabled={loading || deleting}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading || deleting}
      >
        {deleting ? "Deleting..." : "Delete Job"}
      </button>

      {error && <p role="alert">{error}</p>}
    </article>
  );
}

export default JobCard;
