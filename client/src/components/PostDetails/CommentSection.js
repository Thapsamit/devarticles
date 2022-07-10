import React, { useState } from 'react'

const CommentSection = ({article}) => {
    const [Comments,setComments] = useState([1,2,3,4,5,6]);
    console.log(article)
  return (
    <>
      <h2 className="text-2xl">Comment Section</h2> 
      {Comments.map((com,ind)=>(
        <h2>Comment{ind}</h2>
      ))}
    </>
  )
}
export default CommentSection;

