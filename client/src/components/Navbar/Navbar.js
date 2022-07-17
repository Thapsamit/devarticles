import React, { useState, useEffect } from "react";
import img from "./gamer.png";
import { Link, useHistory, useLocation } from "react-router-dom";
import decode from "jwt-decode";
import * as actionTypes from "../../constants/actionTypes";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT });
    history.push("/auth");
    setUser(null);
  };
  useEffect(() => {
    const token = user?.token;
    // logout on expiring the time of 1hr
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);
  return (
    <header className="shadow-lg bg-lightBg text-white">
      <div className="box">
        <div className="w-full p-5 flex justify-between items-center">
          <h1 className="text-lg font-medium">DevArticles</h1>

          <ul className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <Link to="/writeArticle">
                  <li className="text-gray-300 navItems hover:text-primary">
                    Write Article
                  </li>
                </Link>
                <li className="text-gray-300 navItems hover:text-primary">
                  {user.result.name}
                </li>
                <li className="navItems">
                  <img
                    src={img}
                    className="w-[30px] h-[30px]"
                    alt="avatar here"
                  />
                </li>
                <li className="navItems">
                  <button className="btn btn-danger" onClick={logout}>
                    Log Out
                  </button>
                </li>
              </div>
            ) : (
              <li className="navItems">
                <Link to="/auth">
                  <button className="btn-grad">Sign In</button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
