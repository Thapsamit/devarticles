import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthModalContext = createContext({
  isOpen: false,
  mode: "signin",
  openAuth: () => {},
  closeAuth: () => {},
});

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("signin");

  const openAuth = useCallback((nextMode = "signin") => {
    setMode(nextMode === "signup" ? "signup" : "signin");
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, mode, openAuth, closeAuth }),
    [isOpen, mode, openAuth, closeAuth],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);

export default AuthModalContext;
