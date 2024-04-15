import React from "react";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import api from "../api";
import { COOKIES_LIFE_TIME } from "../constants";

const AuthContext = React.createContext();
const cookies = new Cookies(null, { path: "/" });

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(cookies.get("loggedIn") || null);
  const [token, setToken] = React.useState(cookies.get("auth_token") || "");
  const [employerInfo, setEmployerInfo] = React.useState(
    cookies.get("employer_info") || {}
  );

const set_logged_in_cookie = (value) => {
    cookies.set("loggedIn", value, {
        path: "/",
        maxAge: COOKIES_LIFE_TIME,
      });
}

  const loginAction = async ({username, password}) => {
    api
      .signin({
        username,
        password,
      })
      .then((res) => {
        if (res.auth_token) {
          setToken(res.auth_token);
          cookies.set("auth_token", res.auth_token, {
            path: "/",
            maxAge: COOKIES_LIFE_TIME,
          });
          api
            .getUserData()
            .then((res) => {
              setEmployerInfo(res);
              cookies.set("employer_info", res, {
                path: "/",
                maxAge: COOKIES_LIFE_TIME,
              });
              setLoggedIn(true);
              set_logged_in_cookie(true)
            })
            .catch((err) => {
              setLoggedIn(false);
              set_logged_in_cookie(false)
            });
        } else {
          setLoggedIn(false);
          set_logged_in_cookie(false)
        }
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
        setLoggedIn(false);
      });
  };

  const logOut = async () => {
    api
      .signout()
      .then((res) => {
        cookies.remove("auth_token");
        cookies.remove("employer_info");
        setEmployerInfo({});
        setLoggedIn(false);
        set_logged_in_cookie(false)
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loggedIn,
        employerInfo,
        loginAction,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return React.useContext(AuthContext);
};
