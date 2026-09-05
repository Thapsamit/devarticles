import React, { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleMark = () => (
  <svg viewBox="0 0 48 48" className="h-[18px] w-[18px]" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

/**
 * Google's sign-in button renders inside an iframe whose page background is
 * white, so it can't be themed from our stylesheet. We draw our own button and
 * lay the real (fully transparent) Google button on top of it to capture the
 * click — the official button still handles the whole OAuth flow.
 */
const GoogleAuthButton = ({ onSuccess, onError, label, isOpen = true }) => {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !isOpen) return undefined;

    const measure = () =>
      setWidth(Math.max(200, Math.min(400, Math.round(el.offsetWidth))));

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen]);

  return (
    <div ref={wrapRef} className="google-btn-wrap group">
      {/* what the user sees */}
      <div className="pointer-events-none flex h-10 w-full items-center justify-center gap-2.5 rounded-xl2 border border-hair/[0.12] bg-hair/[0.05] text-[14px] font-semibold text-primaryText3 transition-colors duration-200 group-hover:border-hair/[0.2] group-hover:bg-hair/[0.09] group-hover:text-primaryText4">
        <GoogleMark />
        {label || "Continue with Google"}
      </div>

      {/* the real button, invisible, capturing the click */}
      <div className="google-btn-overlay">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          type="standard"
          theme="filled_black"
          shape="rectangular"
          size="large"
          text="continue_with"
          logo_alignment="center"
          width={String(width)}
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;
