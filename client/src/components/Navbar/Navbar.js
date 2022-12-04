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
  const logout = async () => {
    await dispatch({ type: actionTypes.LOGOUT });
    setUser(null);
    history.push("/auth");
   
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
    <header className="shadow-lg bg-lightBg text-white w-full">
      <div className="box">
        <div className="block w-full py-3 sm:flex sm:justify-between sm:items-center">
         <button onClick={()=>{history.push('/')}}><h1 className="text-mainColor text-[1.25rem]">DevArticles</h1></button>
          
          
          <ul className="flex items-center">
            {user ? (
              <div className="block  sm:py-[10px] sm:flex sm:items-center">
                
                
                <Link to="/writeArticle">
                  <li className="py-2 text-gray-300 navItems hover:text-mainColor">
                    Write Article
                  </li>
                </Link>
                <Link to="/bookmarks">
                  <li className="py-2 text-gray-300 navItems hover:text-mainColor">
                    Bookmarks
                  </li>
                </Link>
                <li className="py-2 text-gray-300 navItems hover:text-mainColor">
                  {user?.result.name}
                </li>
                <li className="py-2 navItems">
                  <img
                    src={user?.result?.picture || img}
                    className="w-[30px] h-[30px] rounded"
                    alt="avatar here"
                  />
                </li>
                <li className="py-2 navItems">
                  <button className="btn btn-danger" onClick={logout}>
                    Log Out
                  </button>
                </li>
              </div>
            ) : (
              <li className="py-2 navItems">
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
