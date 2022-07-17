import React from "react";
import Article from "./Article/Article";
import { useSelector } from "react-redux";
const Articles = () => {
  const { articles, isLoading } = useSelector((state) => state.articles);
  
  if (!articles.length && !isLoading) {
    return "No Articles";
  }
  return (
    <>
      {isLoading ? (
        <h1>LOADING...</h1>
      ) : (
        <div className="flex items-center w-full flex-wrap ">
          {articles.map((article) => (
            <Article
              key={article._id}
              article={article}
              
            />
          ))}
        </div>
      )}
    </>
  );
};
export default Articles;
