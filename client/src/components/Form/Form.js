import { useState, useEffect } from "react";
import FileBase64 from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { createArticle, updateArticle } from "../../actions/articles";

/**
 * Legacy compact article form. The full editor lives in WriteArticle —
 * this is kept as a lightweight alternative and styled to match the theme.
 */
const Form = ({ currentId, setCurrentId }) => {
  const [articleData, setArticleData] = useState({
    title: "",
    articleBody: "",
    tags: "",
    selectedFile: "",
  });
  const article = useSelector((state) =>
    currentId ? state.articles.articles.find((p) => p._id === currentId) : null,
  );
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (article) {
      setArticleData(article);
    }
  }, [article]);

  const clear = () => {
    setCurrentId(0);
    setArticleData({ title: "", articleBody: "", tags: "", selectedFile: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(
        updateArticle(currentId, { ...articleData, name: user?.result?.name }),
      );
    } else {
      dispatch(createArticle({ ...articleData, name: user?.result?.name }));
    }
    clear();
  };

  const getFiles = (files) => {
    setArticleData({ ...articleData, selectedFile: files.base64 });
  };

  if (!user?.result?.name) {
    return (
      <div className="surface p-6 text-center">
        <h3 className="font-display text-[16px] font-bold text-primaryText4">
          Sign in to create articles
        </h3>
      </div>
    );
  }

  return (
    <div className="surface p-5 sm:p-6">
      <form onSubmit={handleSubmit}>
        <h3 className="section-title text-[18px]">
          {currentId ? "Edit" : "Write"} an article
        </h3>

        <div className="formBox mt-5">
          <label className="field-label">Title</label>
          <input
            type="text"
            name="title"
            className="custom-input"
            placeholder="Enter article title…"
            value={articleData.title}
            onChange={(e) =>
              setArticleData({ ...articleData, title: e.target.value })
            }
          />
        </div>

        <div className="formBox">
          <label className="field-label">Body</label>
          <textarea
            name="articleBody"
            placeholder="Write your article…"
            value={articleData.articleBody}
            onChange={(e) =>
              setArticleData({ ...articleData, articleBody: e.target.value })
            }
          />
        </div>

        <div className="formBox">
          <label className="field-label">Tags</label>
          <input
            type="text"
            name="tags"
            className="custom-input"
            placeholder="react, node, css"
            value={articleData.tags}
            onChange={(e) =>
              setArticleData({
                ...articleData,
                tags: e.target.value.split(","),
              })
            }
          />
        </div>

        <div className="file-drop formBox rounded-xl2 border-2 border-dashed border-hair/[0.12] bg-hair/[0.02] p-4">
          <FileBase64 multiple={false} onDone={getFiles} />
        </div>

        <button type="submit" className="btn-primary mt-2 w-full">
          Submit
        </button>
        <button type="button" className="btn-gray mt-3 w-full" onClick={clear}>
          Clear
        </button>
      </form>
    </div>
  );
};

export default Form;
