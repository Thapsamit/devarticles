import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineX,
} from "react-icons/hi";

import { signup, signin } from "../../actions/auth";
import { AUTH } from "../../constants/actionTypes";
import { useAuthModal } from "../../context/AuthModalContext";
import GoogleAuthButton from "./GoogleAuthButton";

const initialState = { name: "", email: "", password: "" };

const AuthModal = () => {
  const { isOpen, mode, closeAuth } = useAuthModal();

  const [isLoad, setLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(mode === "signup");
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const history = useHistory();
  const authData = useSelector((state) => state.authReducer?.authData);
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);

  // sync the requested mode each time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsSignUp(mode === "signup");
      setLoad(false);
      setShowPassword(false);
    }
  }, [isOpen, mode]);

  // close as soon as authentication succeeds
  useEffect(() => {
    if (authData) closeAuth();
  }, [authData, closeAuth]);

  // esc to close + lock background scroll while open
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeAuth();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    const focusTimer = setTimeout(() => firstFieldRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, closeAuth]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);

    if (isSignUp) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const switchAuthComponent = () => {
    setIsSignUp((v) => !v);
    setLoad(false);
  };

  const googleSuccess = async (res) => {
    const { name, picture, email, sub } = jwt_decode(res.credential);
    const token = res.credential;
    const result = { name, picture, email, sub };
    await dispatch({ type: AUTH, data: { result, token } });
    closeAuth();
    history.push("/articles");
  };

  const googleFailure = (err) => {
    console.log(err);
  };

  const onBackdropClick = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) closeAuth();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isSignUp ? "Create an account" : "Sign in"}
      onMouseDown={onBackdropClick}
      className="animate-fadeIn fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-scrim/70 p-4 backdrop-blur-md sm:p-6"
    >
      <div
        ref={panelRef}
        className="animate-popIn relative my-auto w-full max-w-[440px] overflow-hidden rounded-3xl border border-hair/[0.09] bg-ink-800 shadow-cardHover"
      >
        {/* glow header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-brandSoft" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet2/20 blur-3xl" />

        <button
          onClick={closeAuth}
          aria-label="Close"
          className="icon-btn absolute right-4 top-4 z-10 h-8 w-8"
        >
          <HiOutlineX className="h-4 w-4" />
        </button>

        <div className="relative px-6 pb-7 pt-8 sm:px-8">
          {/* brand */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-brand font-display text-[15px] font-extrabold text-white">
              {"</>"}
            </span>
            <span className="font-display text-[17px] font-extrabold tracking-tight text-primaryText4">
              Dev<span className="gradient-text">Articles</span>
            </span>
          </div>

          <h2 className="mt-6 font-display text-[24px] font-extrabold tracking-tight text-primaryText4">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1.5 text-[13.5px] text-primaryText1">
            {isSignUp
              ? "Publish articles, save bookmarks, join the discussion."
              : "Sign in to keep reading and writing."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            {isSignUp && (
              <div className="mb-3.5">
                <label className="field-label" htmlFor="auth-name">
                  Full name
                </label>
                <div className="relative">
                  <HiOutlineUser className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-primaryText1" />
                  <input
                    id="auth-name"
                    ref={isSignUp ? firstFieldRef : null}
                    name="name"
                    type="text"
                    placeholder="Ada Lovelace"
                    required
                    className="custom-input py-2.5 pl-11"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="mb-3.5">
              <label className="field-label" htmlFor="auth-email">
                Email address
              </label>
              <div className="relative">
                <HiOutlineMail className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-primaryText1" />
                <input
                  id="auth-email"
                  ref={!isSignUp ? firstFieldRef : null}
                  name="email"
                  type="email"
                  required
                  className="custom-input py-2.5 pl-11"
                  placeholder="you@example.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="field-label" htmlFor="auth-password">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-primaryText1" />
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="custom-input py-2.5 pl-11 pr-11"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-primaryText1 transition-colors hover:text-primaryText3"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="h-[17px] w-[17px]" />
                  ) : (
                    <HiOutlineEye className="h-[17px] w-[17px]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoad}
              className="btn-primary w-full py-3"
            >
              {isLoad
                ? isSignUp
                  ? "Creating account…"
                  : "Signing in…"
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-hair/[0.08]" />
            <span className="text-[11.5px] uppercase tracking-[0.14em] text-primaryText1">
              or
            </span>
            <span className="h-px flex-1 bg-hair/[0.08]" />
          </div>

          <GoogleAuthButton
            isOpen={isOpen}
            onSuccess={googleSuccess}
            onError={googleFailure}
            label={isSignUp ? "Sign up with Google" : "Sign in with Google"}
          />

          <p className="mt-6 text-center text-[13.5px] text-primaryText1">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchAuthComponent}
              className="font-semibold text-accent-400 transition-colors hover:text-accent-300"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
