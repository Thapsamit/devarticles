import { useEffect,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineThumbUp, HiOutlineTrash, HiThumbUp } from "react-icons/hi";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { getArticle,getArticles } from "../../actions/articles";
import { HiUserCircle } from "react-icons/hi";
import { likeArticle, deleteArticle } from "../../actions/articles";

import CommentSection from "./CommentSection";

import Loader from "../Loader/Loader";
const PostDetails = () => {
  const { article, articles, isLoading } = useSelector(
    (state) => state.articles
  );


  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id || user?.result?.sub;
  
  
  const { id } = useParams();
  const dispatch = useDispatch();
  const[commentsCounts,setCommentsCounts] = useState(article ? article?.comments.length : 0)

  const[likes,setLikes] = useState(article ? article?.likes : [])
 
  const hasLiked = likes?.find((like) => like === userId);
  const recommendedPosts = articles.filter(({_id})=>_id!==id)
 
  
  const Likes = () => {
   
    if (likes?.length >= 0) {
      
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
  
  const openArticle = (_id)=>{
    history.push(`/articles/${_id}`);
  }
  const handleLike =  async ()=>{
   await dispatch(likeArticle(article._id));
   
    if (hasLiked) {
      setLikes(likes.filter((id) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }
    
  }
  useEffect(() => {
  
   
    dispatch(getArticles());
    dispatch(getArticle(id));


  }, [dispatch, id]);
  useEffect(()=>{
     setLikes(article?.likes)
  
  },[article])

  if (isLoading)
    return (
      <>
        <Loader/>
      </>
    );
  return (
    <>
      {article && (
        <div className="box mb-[20px]">
          <div className="block md:flex  justify-between mt-[20px]">
            <div className="bg-lightBg w-full mr-[20px] mb-[20px] rounded py-[10px] px-[30px]">
              <div className="flex items-center my-4 mx-0 text-white">
                <HiUserCircle className="w-[40px] h-[40px] mr-[16px]" />
                <div className="text-[12px] font-medium">
                  <p>{article.name}</p>
                  <p className="text-primaryText2">
                    Posted on Date : {moment(article.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              <h3 className="text-mainColor text-[1.5rem] my-[10px]">
                {article.title}
              </h3>
              <div className="w-full mr-[20px]">
                <img
                  src={article.selectedFile}
                  className="w-full h-[50vh] rounded"
                  alt="Article"
                />
              </div>
              <div className="my-2 mx-0">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="tags">#{tag}</span>
                ))}
              </div>

              <div className="all-revert">
                  <div className="ql-editor" dangerouslySetInnerHTML={{__html:article.articleBody}}></div>

              </div>

              <div className="flex  items-center text-[15px] mt-[10px] py-[10px] px-0 border-t-[1px] border-gray-500 border-solid  ">
                <button
                  disabled={!user?.result}
                  onClick={handleLike}
                  className="mr-[20px]"
                >
                  <Likes />
                </button>

                {((user?.result?._id === article?.author) || (user?.result?.sub === article?.author)) && (
                  <div
                    className="flex items-center hover:text-red-500 cursor-pointer"
                    onClick={() => {
                      dispatch(deleteArticle(article._id))
                        .then(() => {
                          history.push("/articles");
                        })
                        .catch((err) => console.log(err));
                    }}
                  >
                    <HiOutlineTrash className="w-[20px] h-[20px] mr-[5px] text-red-500" />
                    <p className="text-red-500">Delete</p>
                  </div>
                )}
              </div>

              <div className="py-[20px]">
                <h4 className="text-mainColor md:text-[1.5rem]">
                  Comment Section {`(${commentsCounts})`}
                </h4>
                <div>
                  <CommentSection article={article} commentsCount={commentsCounts} setCommentsCount={setCommentsCounts}/>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/5">
              <h2 className="customHeadings text-[16px]">
                Recommended Posts For You..
              </h2>
              {recommendedPosts && (
                <div className="bg-lightBg p-[20px] rounded shadow-md text-primaryText1">
                  {recommendedPosts.map(({_id,title,likes})=>(
                    <div key={_id} className="my-[10px] hover:text-mainColor hover:cursor-pointer" onClick={()=>openArticle(_id)}>
                      <h3 className="underline">{title}</h3>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PostDetails;
