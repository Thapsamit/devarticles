import React, { useEffect, useState } from "react";
import Articles from "../Articles/Articles.js";

import categories from "../../categories.json";
import { useHistory, Link, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { getArticles, getArticlesByCategory, getArticlesBySearch } from "../../actions/articles.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
 
  const [search, setSearch] = useState("");

 
  const query = useQuery();
  const category = query.get("category");
  const history = useHistory();
  

 
  
  
  //const query = useQuery();
  //const searchQuery = query.get('searchQuery')
  const dispatch = useDispatch();
  
  
  

  const searchArticle = () => {
    if (search.trim()) {
      dispatch(getArticlesBySearch({ search }));
      history.push(`/articles/search?searchQuery=${search || "none"}`);
    } else {
      history.push("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.which === 13) {
      
      searchArticle();
    }
  };
  useEffect(() => {
  
    
    if(category){
      dispatch(getArticlesByCategory(category))
    }
    else{
      dispatch(getArticles());
    }
   
  }, [dispatch,category]);

  
  return (
    <section>
      <div className="box">
        <div className="my-4">
          <div className="flex items-center">
            <label for="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                name="search"
                className="outline-none bg-lightBg border border-primaryText1 focus:border focus:border-mainColor text-white text-sm rounded-lg  block w-full pl-10 p-2.5   "
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                required
              />
            </div>
            <button
              onClick={searchArticle}
              className="p-2.5 ml-2 text-sm font-medium text-white bg-mainColor rounded-lg border border-blue-700 hover:bg-blue-700 focus:ring-4 focus:outline-none "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
        <div className="block grid-cols-3 w-full md:grid md:gap-2 mt-3">
          <div className="col-start-1 col-end-2">
            <div>
              <h3 className="customHeadings">By Categories</h3>
              <div className="bg-lightBg text-primaryText2 text-[14px] mt-[10px] p-[15px] rounded">
                <ul>
                  {categories.categories.map((category, ind) => (
                    <li key={ind} className="text-[14px] py-[5px] hover:text-mainColor">
                     
                      <Link
                        to={`/articles/categories?category=${category
                          .split(" ")
                          .join("+")}`}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-start-2 col-end-4">
            <h2 className="customHeadings">Latest Articles</h2>
            <Articles />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Home;
