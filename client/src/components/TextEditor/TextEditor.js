import React, { useEffect, useState } from "react";
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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  console.log(articleData);
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
            articleBodyRaw: JSON.stringify(editorState.getCurrentContent()),
          })
        }
      />
    </div>
  );
};

/*
export default class TextEditor extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
  };
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    
  };
  componentDidMount(){
     if(id){
        
     }
  }
  render() {
    const { editorState } = this.state;
    const {articleData,setArticleData,id} = this.props;
  
    return (
      <div>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName bg-lightBg min-h-[500px]"
          editorClassName="editorClassName text-white  p-[10px]"
          onEditorStateChange={this.onEditorStateChange}
          onChange = {()=>setArticleData({...articleData,articleBody:JSON.stringify(convertToRaw(editorState.getCurrentContent()))})}
        />
    
      </div>
    );
  }
}
*/
export default TextEditor;
