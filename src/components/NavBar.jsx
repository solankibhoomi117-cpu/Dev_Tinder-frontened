import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/FeedSlice";

export default function NavBar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(removeUser());
      dispatch(removeFeed());
      setBusy(false);
      navigate("/login", { replace: true });
    }
  };

  const navClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand"><span className="brand-mark">D</span><span>DevTinder</span></Link>
        <nav className="desktop-nav">
          <NavLink to="/" end className={navClass}>Discover</NavLink>
          <NavLink to="/requests" className={navClass}>Requests</NavLink>
          <NavLink to="/connections" className={navClass}>Connections</NavLink>
          <NavLink to="/profile" className={navClass}>My profile</NavLink>
        </nav>
        <div className="account-area">
          <span className="welcome-text">Hi, {user?.firstName || "Developer"}</span>
          <div className="avatar-menu">
            <button className="avatar-button" aria-label="Account menu">
              <img src={user?.photourl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || "Developer")}&background=6d5dfc&color=fff`} alt="Profile" />
            </button>
            <div className="avatar-dropdown">
              <Link to="/profile">Edit profile</Link>
              <Link to="/connections">Connections</Link>
              <button onClick={logout} disabled={busy}>{busy ? "Logging out…" : "Logout"}</button>
            </div>
          </div>
        </div>
      </div>
      <nav className="mobile-nav">
        <NavLink to="/" end className={navClass}>Discover</NavLink>
        <NavLink to="/requests" className={navClass}>Requests</NavLink>
        <NavLink to="/connections" className={navClass}>Connections</NavLink>
        <NavLink to="/profile" className={navClass}>Profile</NavLink>
      </nav>
    </header>
  );
}
