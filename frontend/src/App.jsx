import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import AuthContext from "./contexts/auth-context";
import api from "./api/index";
import SignIn from "./pages/signin/index.jsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState({});

  const authorization = ({ username, password }) => {
    api
      .signin({
        username,
        password,
      })
      .then((res) => {
        if (res.auth_token) {
          localStorage.setItem("token", res.auth_token);
          api
            .getUserData()
            .then((res) => {
              setUser(res);
              setLoggedIn(true);
            })
            .catch((err) => {
              setLoggedIn(false);
            });
        } else {
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(", "));
        }
        setLoggedIn(false);
      });
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/signin" element={<SignIn onSignIn={authorization} />} />
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />}
        />
      </>
    )
  );

  return (
    <AuthContext.Provider value={loggedIn}>
        <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
