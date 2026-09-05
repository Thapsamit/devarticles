import React from "react";
import Home from "./components/Home/Home.js";
import Navbar from "./components/Navbar/Navbar.js";
import Footer from "./components/Footer/Footer.js";
import ScrollToTop from "./components/ScrollToTop.js";
import Auth from "./components/Auth/Auth.js";
import AuthModal from "./components/Auth/AuthModal.js";
import WriteArticle from "./components/WriteArticle/WriteArticle.js";
import PostDetails from "./components/PostDetails/PostDetails.js";
import { AuthModalProvider } from "./context/AuthModalContext.js";
import { ThemeProvider } from "./context/ThemeContext.js";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthModalProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <Switch>
            <Route
              path="/"
              exact
              component={() => <Redirect to="/articles" />}
            />
            <Route path="/articles" exact component={Home} />
            <Route path="/articles/search" exact component={Home} />
            <Route path="/articles/categories" exact component={Home} />
            <Route path="/articles/:id" exact component={PostDetails} />
            <Route path="/auth" exact component={Auth} />
            <Route path="/writeArticle" component={WriteArticle} />
            <Route path="/editArticle/:id" component={WriteArticle} />
            <Route path="/bookmarks" component={Home} />
          </Switch>
        </main>

        <Footer />
      </div>

        <AuthModal />
      </AuthModalProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
