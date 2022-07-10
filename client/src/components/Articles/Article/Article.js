import React from "react";
import {
  HiUserCircle,
  HiOutlineThumbUp,
  HiOutlineTrash,
  HiThumbUp,
} from "react-icons/hi";
import { MdOutlineComment } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deleteArticle, likeArticle } from "../../../actions/articles";
import { Link } from "react-router-dom";
const Article = ({ article, setCurrentId }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const getArticle = () => {
    history.push(`/articles/${article._id}`);
  };

  const Likes = () => {
    if (article?.likes.length >= 0) {
      return article.likes.find((like) => like === user?.result?._id) ? (
        <div className="flex items-center text-primary  cursor-pointer">
          <HiThumbUp className="w-[20px] h-[20px] mr-[5px]" />
          <p className="text-primary">
            You and {article.likes.length - 1} Liked
          </p>
        </div>
      ) : (
        <div className="flex items-center hover:text-primary cursor-pointer">
          <HiOutlineThumbUp className="w-[20px] h-[20px] mr-[5px]" />
          <p>Like {article.likes.length}</p>
        </div>
      );
    }
  };
  return (
    <>
      <div className="bg-white shadow-md w-[300px] rounded-lg overflow-hidden m-2">
        <div className="h-52 relative bg-no-repeat bg-cover bg-center object-cover bg-blend-overlay">
          {user?.result?._id === article?.author && (
             <button
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/editArticle/${article._id}`)
                //setCurrentId(article._id);
              }}
              className="absolute top-1 left-3"
            >
              <BsPencilSquare className="text-primary text-[30px]" />
            </button> 
          )}
          <img
            src={article.selectedFile}
            className="w-full h-full"
            alt="Article"
          />
        </div>
        <div className="py-2.5 px-4">
          <div className="my-1 mx-0">
            {article.tags.map((tag, idx) => (
              <span className="tags">#{tag}</span>
            ))}
          </div>
          <button onClick={getArticle}>
            <h4 className="text-sm text-primary my-2.5 mx-0">
              {article.title}
            </h4>
          </button>

          <p className="text-[12px] my-[10px]">{article.articleBody}</p>
          <div className="flex items-center my-4 mx-0">
            <HiUserCircle className="w-[40px] h-[40px] mr-[16px]" />
            <div className="text-[12px] font-medium">
              <p>{article.name}</p>
              <p>Posted on Date : {moment(article.createdAt).fromNow()}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-[10px] py-[10px] px-0 border-t-[1px] border-gray-500 border-solid  ">
            <button
              disabled={!user?.result}
              onClick={() => dispatch(likeArticle(article._id))}
            >
              <Likes />
            </button>
            <div className="flex items-center hover:text-yellow-300 cursor-pointer">
              <MdOutlineComment className="w-[20px] h-[20px] mr-[5px]" />
              <p>Comment</p>
            </div>
            {user?.result?._id === article?.author && (
              <div
                className="flex items-center hover:text-red-500 cursor-pointer"
                onClick={() => {
                  dispatch(deleteArticle(article._id));
                }}
              >
                <HiOutlineTrash className="w-[20px] h-[20px] mr-[5px]" />
                <p>Delete</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Article;
