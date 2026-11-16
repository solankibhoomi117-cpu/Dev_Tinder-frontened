export default function UserCard({ user, onInterested, onIgnore, busy = false }) {
  if (!user) return null;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const photo = user.photourl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Developer")}&background=7061e8&color=fff&size=600`;
  return (
    <article className="developer-card">
      <div className="developer-photo-wrap"><img className="developer-photo" src={photo} alt={`${name || "Developer"} profile`} /><span className="photo-label">DEVELOPER PROFILE</span></div>
      <div className="developer-info">
        <div className="developer-name-row"><h2>{name || "Developer"}</h2>{user.age && <span className="age-chip">{user.age}</span>}</div>
        {user.gender && <p className="developer-meta">{user.gender}</p>}
        <p className="developer-about">Connect with this developer and explore opportunities to learn and build together.</p>
        <div className="card-actions"><button className="secondary-button" disabled={busy} onClick={onIgnore}>✕ Ignore</button><button className="primary-button" disabled={busy} onClick={onInterested}>{busy ? "Please wait…" : "♥ Interested"}</button></div>
      </div>
    </article>
  );
}
