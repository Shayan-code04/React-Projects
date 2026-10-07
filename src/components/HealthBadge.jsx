import { useEffect, useState } from "react";

function HealthBadge() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {fetch("https://job-tracker-api-tk84.onrender.com/health")
      .then((response) => {
        console.log("HTTP status:", response.status);

        return response.json();
      })
      .then((data) => {
        console.log("Actual API data:", data);

        if (data.status) {
          setStatus(data.status);
        } else if (data.detail) {
          setStatus(data.detail);
        }
      })
      .catch((error) => {
        console.error("API error:", error);
        setStatus("Backend unavailable");
      });
  }, []);

  return <p>Backend: {status}</p>;
}

export default HealthBadge;