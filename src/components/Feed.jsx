import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeFeed } from "../utils/FeedSlice";
import UserCard from "./UserCard";

export default function Feed() {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(feed === null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadFeed = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/feed?page=1&limit=20`, { withCredentials: true });
      dispatch(addFeed(response.data));
      setIndex(0);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load the developer feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (feed === null) loadFeed();
  }, []);

  const sendRequest = async (status) => {
    const person = feed?.[index];
    if (!person?._id || busy) return;
    setBusy(true);
    setError("");
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${person._id}`, {}, { withCredentials: true });
      setIndex((current) => current + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send this request.");
    } finally {
      setBusy(false);
    }
  };

  const person = feed?.[index];
  return (
    <section className="content-wrap">
      <header className="page-heading centered-heading"><p className="eyebrow">YOUR DEVELOPER COMMUNITY</p><h1>Find your people in tech.</h1><p>Discover developers, exchange ideas and create together.</p></header>
      {error && <div className="notice notice-error">{String(error)}</div>}
      {loading ? <div className="loading-state"><span className="loader-ring" /><p>Finding developers…</p></div> :
        person ? <div className="feed-stage"><UserCard user={person} busy={busy} onIgnore={() => sendRequest("Ignored")} onInterested={() => sendRequest("Interested")} /><p className="feed-hint">Your choice is private. Connect with developers who are interested too.</p></div> :
        <div className="empty-state"><span className="empty-icon">✦</span><h2>You’re all caught up!</h2><p>There are no more profiles in your feed right now.</p><button className="primary-button refresh-button" onClick={() => { dispatch(removeFeed()); loadFeed(); }}>Refresh feed</button></div>}
    </section>
  );
}
