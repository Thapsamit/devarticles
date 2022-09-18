import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { commentArticle } from "../../actions/articles";
const CommentSection = ({ article }) => {
  const [Comments, setComments] = useState(article?.comments);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const handleClick = async () => {
    const formattedComment = `${user?.result?.name}:${comment}`;
    const newComments = await dispatch(
      commentArticle(formattedComment, article._id)
    );
    setComments(newComments);
    setComment("");
  };

  return (
    <>
      <div>
        {user?.result?.name && (
          <div className="block md:flex my-[20px]">
            <input
              type="text"
              className="bg-lightBg text-[16px] mb-[20px] text-white text-sm outline-0 w-full transition ease-in-out border-mainColor border p-[16px] rounded-sm placeholder:text-primaryText1 placeholder:text-[12px]"
              placeholder="Enter Your Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="h-full bg-mainColor p-[10px] md:p-[16px] px-[20px] text-white md:px-[50px]"
              onClick={handleClick}
            >
              Add
            </button>
          </div>
        )}

        {Comments.map((com, ind) => (
          <div key={ind}>
              <div className="w-full bg-darkBg py-[10px] px-[20px] border-b-[1px] border-primaryText1 my-[10px]">
                  <h1 className="text-mainColor text-[1rem]">
                     {com.split(':')[0]}
                  </h1>
                   <p className="text-primaryText1 text-[12px]">{com.split(':')[1]}</p>
              </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default CommentSection;
