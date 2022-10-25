import FileBase64 from "react-file-base64";
import { useState, useEffect } from "react";
import { createArticle, updateArticle } from "../../actions/articles";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import TextEditor from "../TextEditor/TextEditor";
const WriteArticle = () => {
  const { id } = useParams();
  
  const article = useSelector((state) =>
    
    id ? state.articles.articles.find((p) => p._id === id) : null
    
  );

  const [articleData, setArticleData] = useState(article ? {...article}:{
    title: "",
    articleBody: "",
    tags: "",
    selectedFile: "",
    category:""
  });
  

  
  
  
  const dispatch = useDispatch();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("profile"));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
     
      await dispatch(updateArticle(id, { ...articleData, name: user?.result?.name }));
    } else {
      await dispatch(createArticle({ ...articleData, name: user?.result?.name }));
    }
    clear(e);
    history.push('/articles')
  };
  const clear = (e) => {
    e.preventDefault();
    setArticleData({ title: "", articleBody: "", tags: "",category:"", selectedFile: "" });
  };

  const getFiles = (files) => {
    setArticleData({ ...articleData, selectedFile: files.base64 });
  };


  useEffect(() => {
    console.log("useffect")
    console.log(article)
    if (article) {
      setArticleData(article);
    }
  }, [article]);
  return (
    <>
      <div className="box">
        <h1 className="mt-[20px] text-mainColor text-[2rem] text-center">
          {id ? 'Edit Your Article':'Write Your Article'}
        </h1>
        <div className="p-[10px] mb-[2rem]">
          <div className="md:w-[70%]">
            <form onSubmit={handleSubmit}>
              <div className="my-[15px]">
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Enter Article Name..."
                  value={articleData.title}
                  onChange={(e) =>
                    setArticleData({ ...articleData, title: e.target.value })
                  }
                />
              </div>
              <div className="my-[15px]">
                <TextEditor articleData = {articleData} setArticleData = {setArticleData} id={id}/>
              </div>
              <div className="my-[15px]">
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Enter Tags by Separated commas(Ex- react,jsx,html)..."
                  value={articleData.tags}
                  onChange={(e) =>
                    setArticleData({
                      ...articleData,
                      tags: e.target.value.split(","),
                    })
                  }
                />
              </div>
              {/*
              <div>
                <select
                  value={articleData.category}
                  className="outline-none bg-lightBg p-[16px] text-primaryText1 text-[12px] rounded block w-full border border-mainColor focus:border-2"
                  onChange={(e)=>setArticleData({...articleData,category:e.target.value})}
                >
                  <option>Select Category</option>
                  {categories.categories.map((category,ind)=>(
                      <option key={ind} value={category}>{category}</option>
                  ))}
                  
                </select>
              </div> 
               */}
              <div className="bg-lightBg my-[15px]  border-2 border-mainColor border-dashed p-[20px]">
                 <p className="text-primaryText1 text-[18px] mb-[10px]">Put a Thumbnail Image..</p>
                <FileBase64 multiple={false} onDone={getFiles}/>
              </div>
              <div className="my-[15px]">
                <button
                  type="submit"
                  className="btn py-[12px] px-[50px] mr-[15px]"
                >
                  Submit
                </button>
                <button
                  className="bg-clearBtn btn py-[12px] px-[50px]"
                  onClick={clear}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default WriteArticle;
