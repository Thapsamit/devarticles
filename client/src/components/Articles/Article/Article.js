import React, { useState } from "react";
import {
  HiUserCircle,
  HiOutlineThumbUp,
  HiOutlineTrash,
  HiThumbUp,
} from "react-icons/hi";

import {  BsBookmarkPlus } from "react-icons/bs";
import { MdOutlineInsertComment } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  deleteArticle,
  likeArticle,
  addingBookmark,
} from "../../../actions/articles";

const Article = ({ article }) => {
  const [likes, setLikes] = useState(article?.likes);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id || user?.result?.sub;
  const hasLiked = likes.find((like) => like === userId);
  /*
  const formattedArticleBody = (str) => {
    if (str.length > 100) {
      let reducedStr = str.substring(0, 101);
      reducedStr += "...";
      return reducedStr;
    } else {
      return str;
    }
  };
  */
  const getArticle = () => {
    history.push(`/articles/${article._id}`);
  };
  const addBookmark = (e) => {
    e.preventDefault();
    dispatch(addingBookmark(article._id));
  };
  const handleLikeClick = async () => {
    dispatch(likeArticle(article._id));
    if (hasLiked) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }
  };
  const Likes = () => {
    if (likes.length >= 0) {
      return likes.find((like) => like === userId) ? (
        <div className="flex items-center  text-mainColor cursor-pointer">
          <HiThumbUp className="w-[20px] h-[20px] mr-[5px]" />
          <p className="text-mainColor">Like {likes.length}</p>
        </div>
      ) : (
        <div className="flex items-center text-primaryText2 hover:text-mainColor cursor-pointer">
          <HiOutlineThumbUp className="w-[20px] h-[20px] mr-[5px]" />
          <p>Like {likes.length}</p>
        </div>
      );
    }
  };
  return (
    <>
      <div className="bg-lightBg shadow-md rounded-lg overflow-hidden my-[10px] w-full">
        <div className="flex p-[10px]">
          <div className="hidden md:w-[30%] md:block md:mr-[20px]">
            <img
              src={article.selectedFile}
              className="w-full h-full rounded"
              alt="Article"
            />
          </div>
          <div className="w-full px-[10px] text-xl md:w-[70%] md:px-0">
            <div className="flex justify-between">
              <button onClick={getArticle}>
                <h3 className="text-mainColor underline text-left"> {article.title}</h3>
              </button>

              {(user?.result?._id === article?.author ||
                user?.result?.sub === article?.author) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(`/editArticle/${article._id}`);
                  }}
                >
                  <BsPencilSquare className="text-mainColor text-[20px]" />
                </button>
              )}
            </div>

            <p className="text-white text-[12px] py-[5px]">
              Click To View Content.....
            </p>
            <div className="my-1 mx-0  md:flex">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="tags inline-block my-[5px] sm:inline md:inline">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center my-4 mx-0 text-white">
              <HiUserCircle className="w-[40px] h-[40px] mr-[16px]" />
              <div className="text-[12px] font-medium">
                <p>{article.name}</p>
                <p className="text-primaryText2">
                  Posted on Date : {moment(article.createdAt).fromNow()}
                </p>
              </div>
            </div>

            <div className="md:flex md:items-center text-[15px] mt-[10px] py-[10px] px-0 border-t-[1px] border-gray-500 border-solid  ">
              <button
                disabled={!user?.result}
                onClick={handleLikeClick}
                className="mr-[20px]"
              >
                <Likes />
              </button>
              <div className="flex items-center"> <MdOutlineInsertComment className="w-[20px] h-[20px] mr-[5px] text-yellow-500" />
              <p className="text-yellow-500 mr-[20px]">
                Comments {article?.comments.length}{" "}
              </p></div>
             
              {user?.result?._id && (
                <button
                  disabled={!user?.result}
                  onClick={addBookmark}
                  className="mr-[20px]"
                >
                  <div className="flex items-center justify-center">
                    <BsBookmarkPlus className="text-primaryText2 w-[20px] h-[20px] mr-[5px]" />
                    <p className=" text-primaryText2">Bookmark</p>
                  </div>
                </button>
              )}

              {(user?.result?._id === article?.author ||
                user?.result?.sub === article?.author) && (
                <div
                  className="flex items-center hover:text-red-500 cursor-pointer"
                  onClick={() => {
                    dispatch(deleteArticle(article._id));
                  }}
                >
                  <HiOutlineTrash className="w-[20px] h-[20px] mr-[5px] text-red-500" />
                  <p className="text-red-500">Delete</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Article;
