import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const initialForm = { firstName: "", lastName: "", email: "", password: "", age: "", gender: "", photourl: "", about: "", skills: "" };

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
    };
    if (form.age) payload.age = Number(form.age);
    if (form.gender) payload.gender = form.gender;
    if (form.photourl.trim()) payload.photourl = form.photourl.trim();
    if (form.about.trim()) payload.about = form.about.trim();
    if (form.skills.trim()) payload.skills = form.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    try {
      await axios.post(`${BASE_URL}/Signup`, payload, { withCredentials: true });
      setSuccess("Account created successfully. Redirecting to sign in…");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(typeof err.response?.data === "string" ? err.response.data : "Unable to create your account. Please check the information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page signup-page">
      <section className="auth-story">
        <div className="story-pill">✦ JOIN THE COMMUNITY</div>
        <h1>Your next great idea starts with <span>a connection.</span></h1>
        <p>Create your profile and meet people who are just as excited about building things as you are.</p>
      </section>
      <section className="auth-panel">
        <div className="auth-card signup-card">
          <p className="eyebrow">GET STARTED</p><h2>Create account</h2><p className="muted">Add your details to join DevTinder.</p>
          <form onSubmit={submit} className="form-grid">
            <label>First name *<input name="firstName" required minLength="3" maxLength="10" value={form.firstName} onChange={update} /></label>
            <label>Last name *<input name="lastName" required minLength="3" maxLength="254" value={form.lastName} onChange={update} /></label>
            <label className="span-two">Email address *<input name="email" type="email" required maxLength="20" value={form.email} onChange={update} placeholder="you@example.com" /></label>
            <label className="span-two">Password *<input name="password" type="password" required minLength="8" value={form.password} onChange={update} placeholder="Use uppercase, lowercase, number and symbol" /></label>
            <label>Age<input name="age" type="number" min="18" value={form.age} onChange={update} /></label>
            <label>Gender<select name="gender" value={form.gender} onChange={update}><option value="">Select</option><option>Male</option><option>Female</option><option>Others</option></select></label>
            <label className="span-two">
  Profile photo URL
  <input
    name="photourl"
    type="text"
    inputMode="url"
    value={form.photourl}
    onChange={update}
    placeholder="https://example.com/photo.jpg"
    autoComplete="url"
  />
</label>
            <label className="span-two">About you<textarea name="about" minLength="5" maxLength="50" value={form.about} onChange={update} placeholder="Tell developers a little about yourself (5–50 characters)" /></label>
            <label className="span-two">Skills<input name="skills" value={form.skills} onChange={update} placeholder="React, Node.js, MongoDB (comma separated)" /></label>
            {error && <p className="form-error span-two">{error}</p>}
            {success && <p className="form-success span-two">{success}</p>}
            <button className="primary-button span-two" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
