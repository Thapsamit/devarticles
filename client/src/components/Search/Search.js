import React from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

/** Reusable search field used on the articles listing. */
export const Search = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search articles, tags, authors…",
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.which === 13) onSubmit?.();
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="group relative flex-1">
        <HiOutlineSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-primaryText1 transition-colors group-focus-within:text-accent-400" />

        <input
          type="text"
          name="search"
          aria-label="Search articles"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          className="custom-input py-3.5 pl-11 pr-10"
        />

        {value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-primaryText1 transition-colors hover:text-primaryText4"
          >
            <HiOutlineX className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <button
        onClick={onSubmit}
        className="btn-primary shrink-0 px-5 py-3.5"
        aria-label="Search"
      >
        <HiOutlineSearch className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
};

export default Search;
