import React, { useState, useEffect, useRef } from "react";
import img from "./gamer.png";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import decode from "jwt-decode";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlinePencilAlt,
  HiOutlineBookmark,
  HiOutlineLogout,
  HiOutlineHome,
} from "react-icons/hi";

import * as actionTypes from "../../constants/actionTypes";
import Avatar from "../UI/Avatar";
import ThemeToggle from "../UI/ThemeToggle";

import { useDispatch, useSelector } from "react-redux";
import { useAuthModal } from "../../context/AuthModalContext";

const NAV_LINKS = [
  { to: "/articles", label: "Articles", icon: HiOutlineHome },
  {
    to: "/writeArticle",
    label: "Write",
    icon: HiOutlinePencilAlt,
    private: true,
  },
  {
    to: "/bookmarks",
    label: "Bookmarks",
    icon: HiOutlineBookmark,
    private: true,
  },
];

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { openAuth } = useAuthModal();
  const authData = useSelector((state) => state.authReducer?.authData);

  const logout = async () => {
    await dispatch({ type: actionTypes.LOGOUT });
    setUser(null);
    setMenuOpen(false);
    setMobileOpen(false);
    history.push("/articles");
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
    setMobileOpen(false);
    setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, authData]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickAway = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  const links = NAV_LINKS.filter((l) => !l.private || user?.result);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-hair/[0.08] bg-ink-900/[0.85] backdrop-blur-xl shadow-card"
          : "border-transparent bg-ink-900/50 backdrop-blur-md"
      }`}
    >
      <div className="box">
        <nav className="flex h-16 items-center justify-between gap-4">
          {/* ---------- brand ---------- */}
          <Link to="/articles" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-brand font-display text-[15px] font-extrabold text-white shadow-[0_8px_20px_-8px_rgba(79,141,249,.9)] transition-transform duration-300 group-hover:scale-105">
              {"</>"}
            </span>
            <span className="font-display text-[18px] font-extrabold tracking-tight text-primaryText4">
              Dev<span className="gradient-text">Articles</span>
            </span>
          </Link>

          {/* ---------- desktop links ---------- */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  exact={to === "/articles"}
                  className="flex items-center gap-2 rounded-xl2 px-3.5 py-2 text-[14.5px] font-medium text-primaryText2 transition-all duration-200 hover:bg-hair/[0.06] hover:text-primaryText4"
                  activeClassName="!text-accent-300 bg-accent-500/[0.12]"
                >
                  <Icon className="h-[17px] w-[17px]" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ---------- right side ---------- */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user?.result ? (
              <>
                <Link to="/writeArticle" className="hidden sm:inline-flex">
                  <button className="btn-primary btn-sm">
                    <HiOutlinePencilAlt className="h-4 w-4" />
                    Write
                  </button>
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-hair/[0.09] bg-hair/[0.04] p-1 pr-1 transition-colors hover:bg-hair/[0.09]"
                    aria-label="Account menu"
                  >
                    <Avatar
                      name={user?.result?.name}
                      src={user?.result?.picture || undefined}
                      size="sm"
                      ring={false}
                    />
                  </button>

                  {menuOpen && (
                    <div className="animate-popIn absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-hair/[0.09] bg-ink-800/95 shadow-cardHover backdrop-blur-xl">
                      <div className="flex items-center gap-3 border-b border-hair/[0.07] px-4 py-3.5">
                        <Avatar
                          name={user?.result?.name}
                          src={user?.result?.picture || img}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-semibold text-primaryText4">
                            {user?.result?.name}
                          </p>
                          <p className="truncate text-[11.5px] text-primaryText1">
                            {user?.result?.email || "Signed in"}
                          </p>
                        </div>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to="/writeArticle"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl2 px-3 py-2.5 text-[14px] text-primaryText2 transition-colors hover:bg-hair/[0.06] hover:text-primaryText4"
                        >
                          <HiOutlinePencilAlt className="h-[17px] w-[17px]" />
                          Write an article
                        </Link>
                        <Link
                          to="/bookmarks"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl2 px-3 py-2.5 text-[14px] text-primaryText2 transition-colors hover:bg-hair/[0.06] hover:text-primaryText4"
                        >
                          <HiOutlineBookmark className="h-[17px] w-[17px]" />
                          Bookmarks
                        </Link>
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-2.5 rounded-xl2 px-3 py-2.5 text-left text-[14px] text-dangerText transition-colors hover:bg-red-500/[0.12]"
                        >
                          <HiOutlineLogout className="h-[17px] w-[17px]" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  onClick={() => openAuth("signin")}
                  className="btn-ghost btn-sm"
                >
                  Sign in
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="btn-grad btn-sm"
                >
                  Get started
                </button>
              </div>
            )}

            {/* ---------- mobile toggle ---------- */}
            <button
              className="icon-btn md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <HiOutlineX className="h-5 w-5" />
              ) : (
                <HiOutlineMenuAlt3 className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ---------- mobile panel ---------- */}
      {mobileOpen && (
        <div className="animate-fadeIn border-t border-hair/[0.07] bg-ink-900/95 backdrop-blur-xl md:hidden">
          <div className="box space-y-1 py-4">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                exact={to === "/articles"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl2 px-3 py-3 text-[15px] font-medium text-primaryText2 transition-colors hover:bg-hair/[0.06] hover:text-primaryText4"
                activeClassName="!text-accent-300 bg-accent-500/[0.12]"
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </NavLink>
            ))}

            <div className="divider my-3" />

            <ThemeToggle full />

            {user?.result ? (
              <button onClick={logout} className="btn-danger w-full">
                <HiOutlineLogout className="h-[17px] w-[17px]" />
                Log out
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth("signin");
                  }}
                  className="btn-ghost w-full"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuth("signup");
                  }}
                  className="btn-grad w-full"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
