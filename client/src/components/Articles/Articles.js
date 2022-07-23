import React from "react";
import Article from "./Article/Article";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
const Articles = () => {
  const { articles, isLoading } = useSelector((state) => state.articles);
  
  if (!articles.length && !isLoading) {
    return <><h1 className="text-primaryText2 text-center text-[20px]">No Articles Found...</h1></>
  }
  return (
    <>
      {isLoading ? (
        <Loader/>
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
