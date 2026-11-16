import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

export default function Profile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age ?? "",
    gender: user?.gender || "",
    photourl: user?.photourl || "",
    about: user?.about || "",
    skills: (user?.skills || []).join(", "),
  }));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    const payload = { firstName: form.firstName, lastName: form.lastName };
    if (form.age !== "") payload.age = Number(form.age);
    if (form.gender) payload.gender = form.gender;
    if (form.photourl) payload.photourl = form.photourl;
    if (form.about) payload.about = form.about;
    if (form.skills.trim()) payload.skills = form.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    else payload.skills = [];
    try {
      const response = await axios.patch(`${BASE_URL}/profile/edit`, payload, { withCredentials: true });
      dispatch(addUser(response.data.data));
      setMessage(response.data.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Could not update your profile.");
    } finally { setSaving(false); }
  };

  return (
    <section className="content-wrap narrow-wrap">
      <header className="page-heading"><p className="eyebrow">YOUR SPACE</p><h1>Edit your profile</h1><p>Help other developers get to know you.</p></header>
      <form className="surface-card profile-form" onSubmit={submit}>
        <div className="form-grid">
          <label>First name *<input name="firstName" required minLength="3" maxLength="20" value={form.firstName} onChange={update} /></label>
          <label>Last name *<input name="lastName" required minLength="3" maxLength="20" value={form.lastName} onChange={update} /></label>
          <label>Age<input name="age" type="number" min="18" value={form.age} onChange={update} /></label>
          <label>Gender<select name="gender" value={form.gender} onChange={update}><option value="">Select</option><option>Male</option><option>Female</option><option>Others</option></select></label>
          <label className="span-two">Profile photo URL<input name="photourl" type="url" value={form.photourl} onChange={update} /></label>
          <label className="span-two">About<textarea name="about" minLength="5" maxLength="50" value={form.about} onChange={update} /></label>
          <label className="span-two">Skills (comma separated)<input name="skills" value={form.skills} onChange={update} /></label>
        </div>
        {message && <div className="notice notice-success">{message}</div>}
        {error && <div className="notice notice-error">{String(error)}</div>}
        <button className="primary-button form-submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </form>
    </section>
  );
}
