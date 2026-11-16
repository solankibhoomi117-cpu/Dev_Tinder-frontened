<<<<<<< HEAD
# DevTinder Frontend (matched to supplied backend)

This is a complete React frontend for the routes exposed by your supplied Express backend.

## Features connected to your backend
- Signup: `POST /Signup`
- Login: `POST /login`
- Session/profile check: `GET /profile/view`
- Feed: `GET /feed?page=1&limit=20`
- Send request: `POST /request/send/:status/:toUserId`
- Review request: `POST /request/review/:status/:requestId`
- Received requests: `GET /user/requests/received`
- Accepted connections: `GET /user/connections`
- Edit profile: `PATCH /profile/edit`
- Logout: `POST /logout`

## Run
1. Start your backend on `http://localhost:8080`.
2. Run `npm install` in this folder.
3. Optional: copy `.env.example` to `.env` and set `VITE_BACKEND_URL`.
4. Run `npm run dev` and open the Vite URL (normally `http://localhost:5173`).

The browser requests include `withCredentials: true` to use the backend's login cookie.
=======
# Dev_Tinder
>>>>>>> b015d741b96bbf5b01628a07912122bb96343fc4
