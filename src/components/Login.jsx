import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password }, { withCredentials: true });
      dispatch(addUser(response.data));
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(typeof err.response?.data === "string" ? err.response.data : "Unable to sign in. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="story-pill">✦ YOUR DEVELOPER COMMUNITY</div>
        <h1>Good code gets better <span>together.</span></h1>
        <p>Meet developers, discover shared interests and find your next coding partner.</p>
        <div className="story-points"><span>01&nbsp; Discover people</span><span>02&nbsp; Make connections</span><span>03&nbsp; Build together</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in</h2>
          <p className="muted">Continue your developer journey.</p>
          <form onSubmit={handleLogin} className="form-stack">
            <label>Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /></label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="auth-switch">New to DevTinder? <Link to="/signup">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
