function JobCard({ company, role, status }) {
  return (
    <article>
      <h2>{company}</h2>
      <p>Role: {role}</p>
      <p>Status: {status || "Not specified"}</p>
    </article>
  );
}

export default JobCard;