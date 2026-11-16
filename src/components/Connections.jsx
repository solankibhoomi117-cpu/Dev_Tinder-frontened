import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

export default function Connections() {
  const [connections, setConnections] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    axios.get(`${BASE_URL}/user/connections`, { withCredentials: true })
      .then((response) => { if (active) setConnections(response.data); })
      .catch((err) => { if (active) { setError(err.response?.data?.message || "Could not load connections."); setConnections([]); } });
    return () => { active = false; };
  }, []);

  return (
    <section className="content-wrap">
      <header className="page-heading"><p className="eyebrow">YOUR NETWORK</p><h1>Connections</h1><p>Developers who have accepted your connection request.</p></header>
      {error && <div className="notice notice-error">{String(error)}</div>}
      {connections === null ? <div className="loading-state"><span className="loader-ring" /><p>Loading connections…</p></div> :
        connections.length ? <div className="people-grid">{connections.map((person) => <article className="person-tile" key={person._id}><img src={person.photourl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.firstName || "Dev")}&background=7061e8&color=fff`} alt="" /><div><h2>{person.firstName} {person.lastName}</h2><p>{person.gender || "Developer"}{person.age ? ` · ${person.age}` : ""}</p></div></article>)}</div> :
        <div className="empty-state"><span className="empty-icon">♡</span><h2>Your network starts here</h2><p>Discover developers and send an interested request.</p><Link className="primary-button inline-button" to="/">Discover developers</Link></div>}
    </section>
  );
}
