import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

export default function Requests() {
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load connection requests.");
      setRequests([]);
    }
  };
  useEffect(() => { loadRequests(); }, []);

  const review = async (requestId, status) => {
    setBusyId(requestId); setError("");
    try {
      await axios.post(`${BASE_URL}/request/review/${status}/${requestId}`, {}, { withCredentials: true });
      setRequests((current) => current.filter((request) => request._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update this request.");
    } finally { setBusyId(""); }
  };

  return (
    <section className="content-wrap">
      <header className="page-heading"><p className="eyebrow">INCOMING CONNECTIONS</p><h1>Connection requests</h1><p>Review developers who want to connect with you.</p></header>
      {error && <div className="notice notice-error">{String(error)}</div>}
      {requests === null ? <div className="loading-state"><span className="loader-ring" /><p>Loading requests…</p></div> :
        requests.length ? <div className="request-grid">{requests.map((request) => {
          const person = request.fromUserId || {};
          return <article className="request-tile" key={request._id}>
            <img src={person.photourl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.firstName || "Dev")}&background=7061e8&color=fff`} alt="" />
            <div className="request-details"><h2>{person.firstName} {person.lastName}</h2><p>{person.gender || "Developer"}{person.age ? ` · ${person.age}` : ""}</p><div className="request-actions"><button className="primary-button small-button" disabled={busyId === request._id} onClick={() => review(request._id, "Accepted")}>Accept</button><button className="secondary-button small-button" disabled={busyId === request._id} onClick={() => review(request._id, "Rejected")}>Reject</button></div></div>
          </article>;
        })}</div> :
        <div className="empty-state"><span className="empty-icon">✉</span><h2>No pending requests</h2><p>When someone wants to connect, their request will appear here.</p></div>}
    </section>
  );
}
