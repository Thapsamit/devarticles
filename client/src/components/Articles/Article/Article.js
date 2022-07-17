import React, { useState } from "react";
import {
  HiUserCircle,
  HiOutlineThumbUp,
  HiOutlineTrash,
  HiThumbUp,
} from "react-icons/hi";
import { MdOutlineInsertComment } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deleteArticle, likeArticle } from "../../../actions/articles";

const Article = ({ article }) => {
  const [likes, setLikes] = useState(article?.likes);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id;
  const hasLiked = likes.find((like) => like === userId);

  const getArticle = () => {
    history.push(`/articles/${article._id}`);
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
        <div className="flex p-[10px] h-[250px]">
          <div className="w-[30%] mr-[20px]">
            <img
              src={article.selectedFile}
              className="w-full h-full rounded"
              alt="Article"
            />
          </div>
          <div className="text-xl w-[70%]">
            <div className="flex justify-between">
              <button onClick={getArticle}>
                <h3 className="text-mainColor underline"> {article.title}</h3>
              </button>

              {user?.result?._id === article?.author && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    history.push(`/editArticle/${article._id}`);
                    //setCurrentId(article._id);
                  }}
                >
                  <BsPencilSquare className="text-mainColor text-[20px]" />
                </button>
              )}
            </div>

            <p className="text-white text-[12px] py-[5px]">
              {article.articleBody}
            </p>
            <div className="my-1 mx-0">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="tags" >#{tag}</span>
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

            <div className="flex items-center text-[15px] mt-[10px] py-[10px] px-0 border-t-[1px] border-gray-500 border-solid  ">
              <button
                disabled={!user?.result}
                onClick={handleLikeClick}
                className="mr-[20px]"
              >
                <Likes />
              </button>
              <MdOutlineInsertComment className="w-[20px] h-[20px] mr-[5px] text-yellow-500"/>
              <p className="text-yellow-500 mr-[10px]">Comments {article?.comments.length} </p>


              {user?.result?._id === article?.author && (
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
