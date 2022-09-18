import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar,{ modules, formats } from './EditorToolbar';

const TextEditor = ({articleData, setArticleData, id})=>{
  
       return(
        <div className="bg-white">
          <EditorToolbar toolbarId={'t1'}/>
          <ReactQuill value={articleData.articleBody} onChange={(value)=>setArticleData({...articleData,articleBody:value})} theme="snow" placeholder="Write Something Here..." modules={modules('t1')}
         formats={formats}/>
        </div>
       )
}
/*
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
const TextEditor = ({ articleData, setArticleData, id }) => {
  console.log(id)
  const [editorState, setEditorState] = useState(()=>{
    if(id!==undefined){
      EditorState.createWithContent()
    }
    else{
      EditorState.createEmpty();
    }
  });
 

  
  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
 
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName bg-lightBg min-h-[500px]"
        editorClassName="editorClassName text-white  p-[10px]"
        onEditorStateChange={handleEditorStateChange}
        onChange={() =>
          setArticleData({
            ...articleData,
            articleBody: draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            ),
            articleBodyRaw: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          })
        }
      />
    </div>
  );
};

*/
export default TextEditor;
