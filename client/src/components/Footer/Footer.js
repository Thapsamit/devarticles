import React from "react";
import { Link } from "react-router-dom";
import categories from "../../categories.json";
import { useAuthModal } from "../../context/AuthModalContext";

const Footer = () => {
  const { openAuth } = useAuthModal();

  return (
    <footer className="mt-16 border-t border-hair/[0.07] bg-ink-900/60">
      <div className="box py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* brand */}
          <div>
            <Link to="/articles" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-brand font-display text-[15px] font-extrabold text-white">
                {"</>"}
              </span>
              <span className="font-display text-[18px] font-extrabold tracking-tight text-primaryText4">
                Dev<span className="gradient-text">Articles</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-primaryText1">
              A community space for developers to publish what they learn, read
              what others build, and keep the good stuff bookmarked.
            </p>
          </div>

          {/* categories */}
          <div>
            <h4 className="customHeadings">Categories</h4>
            <ul className="mt-4 space-y-2.5">
              {categories.categories.slice(0, 5).map((c) => (
                <li key={c}>
                  <Link
                    to={`/articles/categories?category=${c.split(" ").join("+")}`}
                    className="text-[14px] text-primaryText2 transition-colors hover:text-accent-300"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* links */}
          <div>
            <h4 className="customHeadings">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/articles"
                  className="text-[14px] text-primaryText2 transition-colors hover:text-accent-300"
                >
                  Latest articles
                </Link>
              </li>
              <li>
                <Link
                  to="/writeArticle"
                  className="text-[14px] text-primaryText2 transition-colors hover:text-accent-300"
                >
                  Write an article
                </Link>
              </li>
              <li>
                <Link
                  to="/bookmarks"
                  className="text-[14px] text-primaryText2 transition-colors hover:text-accent-300"
                >
                  Bookmarks
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openAuth("signin")}
                  className="text-[14px] text-primaryText2 transition-colors hover:text-accent-300"
                >
                  Sign in
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider mt-10" />

        <div className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
          <p className="text-[13px] text-primaryText1">
            © {new Date().getFullYear()} DevArticles. Built with React.
          </p>
          <p className="text-[13px] text-primaryText1">
            Made for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
