import mongoose from 'mongoose'
const PostArticlesSchema = new mongoose.Schema({
    title:String,
    name:String,
    articleBody:String,
    author:String,
    tags:[String],
    selectedFile:String,
   likes:{
    type:[String],
    default:[]
   },
    createdAt:{
        type:Date,
        default:new Date()
    }
})

const postArticles = new mongoose.model('postArticles',PostArticlesSchema)
export default postArticles