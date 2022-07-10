import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getArticle } from "../../actions/articles";
import { HiUserCircle } from "react-icons/hi";

import moment from "moment";
import  CommentSection  from "./CommentSection";
const PostDetails = () => {
  const { article, isLoading } = useSelector(
    (state) => state.articles
  );
  console.log(article);
 
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getArticle(id));
  }, [dispatch,id]);
 

  if (isLoading)
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  return (
    <>
      {article && (
        <div className="box">
          <div className="w-full">
            <div>
              <h1>{article.title}</h1>
            </div>

            <img src={article.selectedFile} alt="Article"/>
            <div className="my-1 mx-0">
              {article.tags.map((tag, idx) => (
                <span className="tags">#{tag}</span>
              ))}
            </div>
            <h1>{article.articleBody}</h1>
            <div className="flex items-center my-4 mx-0">
              <HiUserCircle className="w-[40px] h-[40px] mr-[16px]" />
              <div className="text-[12px] font-medium">
                <p>{article.name}</p>
                <p>Posted on Date : {moment(article.createdAt).fromNow()}</p>
              </div>
            </div>
            <CommentSection article={article} />
          </div>
        </div>
      )}
    </>
  );
};
export default PostDetails;
