import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { addUser, removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

export default function Body() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [checking, setChecking] = useState(!user);
  const [authenticated, setAuthenticated] = useState(Boolean(user));

  useEffect(() => {
    let active = true;
    const checkLogin = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile/view`, { withCredentials: true });
        if (active) {
          dispatch(addUser(response.data));
          setAuthenticated(true);
        }
      } catch (error) {
        if (active) {
          dispatch(removeUser());
          setAuthenticated(false);
        }
      } finally {
        if (active) setChecking(false);
      }
    };
    if (!user) checkLogin();
    else {
      setAuthenticated(true);
      setChecking(false);
    }
    return () => { active = false; };
  }, [dispatch, user]);

  if (checking) return <div className="screen-loader"><span className="loader-ring" /><p>Checking your session…</p></div>;
  if (!authenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return (
    <div className="app-shell">
      <NavBar />
      <main className="main-content"><Outlet /></main>
      <Footer />
    </div>
  );
}
