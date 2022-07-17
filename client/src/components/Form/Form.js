import { useState, useEffect } from "react";
//import ReactImageFileToBase64 from "react-file-image-to-base64";
import FileBase64 from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { createArticle, updateArticle } from "../../actions/articles";

const Form = ({ currentId, setCurrentId }) => {
  const [articleData, setArticleData] = useState({
    title: "",
    articleBody: "",
    tags: "",
    selectedFile: "",
  });
  const article = useSelector((state) =>
    currentId ? state.articles.articles.find((p) => p._id === currentId) : null
  );
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  useEffect(() => {
    
    if (article) {
      setArticleData(article);
    }
  }, [article]);
  const handleSubmit = (e) => {
    e.preventDefault();
   
    if (currentId) {
      dispatch(
        updateArticle(currentId, { ...articleData, name: user?.result?.name })
      );
      clear();
    } else {
      dispatch(createArticle({ ...articleData, name: user?.result?.name }));
      clear();
    }
  };
  /*
  const handleOnCompleted = (files) => {
    setArticleData({ ...articleData, selectedFile: files[0].base64_file });
  };
  */
 const getFiles = (files)=>{
  setArticleData({ ...articleData, selectedFile: files.base64 });
 }
  const clear = (e) => {
    setCurrentId(0);
    setArticleData({ title: "", articleBody: "", tags: "", selectedFile: "" });
  };
  if (!user?.result?.name) {
    return <h3>Sign in to create articles</h3>;
  }
  return (
    <>
      <div className="p-2 shadow-md rounded-md bg-white px-5 py-4 ">
        <form onSubmit={handleSubmit}>
          <div className="formBox">
            <h3 className="text-center my-2 text-lg text-secondary">
              {currentId ? "Edit" : "Write"} An Article
            </h3>
          </div>
          <div className="formBox">
            <input
              type="text"
              name="title"
              placeholder="Enter Article title..."
              value={articleData.title}
              onChange={(e) =>
                setArticleData({ ...articleData, title: e.target.value })
              }
            />
          </div>
          <div className="formBox">
            <textarea
              name="articleBody"
              placeholder="Enter Article Body....."
              value={articleData.articleBody}
              onChange={(e) =>
                setArticleData({ ...articleData, articleBody: e.target.value })
              }
            ></textarea>
          </div>
          <div className="formBox">
            <input
              type="text"
              placeholder="Enter Tags"
              name="tags"
              value={articleData.tags}
              onChange={(e) =>
                setArticleData({
                  ...articleData,
                  tags: e.target.value.split(","),
                })
              }
            />
          </div>
          <div>
            <FileBase64 multiple={false} onDone={getFiles} />
            {/* <ReactImageFileToBase64
              multiple={false}
              onCompleted={handleOnCompleted}
            />*/}
          </div>
          <button type="submit" className="btn w-full">
            Submit
          </button>
          <button className="danger w-full" onClick={clear}>
            Clear
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
