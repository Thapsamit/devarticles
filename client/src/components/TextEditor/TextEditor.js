import React from "react";
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

export default TextEditor;
