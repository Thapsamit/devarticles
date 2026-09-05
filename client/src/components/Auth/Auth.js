import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuthModal } from "../../context/AuthModalContext";

/**
 * Route bridge for /auth. Authentication now lives in a modal, so this route
 * exists only so deep links (and older bookmarks) still work: it opens the
 * modal over the articles feed and rewrites the URL.
 */
const Auth = () => {
  const { openAuth } = useAuthModal();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const mode = new URLSearchParams(location.search).get("mode");
    const user = JSON.parse(localStorage.getItem("profile"));

    history.replace("/articles");
    if (!user) openAuth(mode === "signup" ? "signup" : "signin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Auth;
