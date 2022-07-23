import axios from 'axios'



const API = axios.create({baseURL:'http://localhost:5000'})
// interceptors to help middeleware to work 
API.interceptors.request.use((req)=>{
          if(localStorage.getItem('profile')){
          	req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
          }
          return req;
})


export const fetchArticle = (id) => API.get(`/articles/${id}`);
export const fetchArticles = ()=> API.get('/articles');
export const fetchByCategory = (category)=> API.get(`/articles/categories?category=${category}`)
export const fetchArticlesBySearch = (searchQuery) =>API.get(`/articles/search?searchQuery=${searchQuery.search || 'none'}`)
export const createArticle = (newArticle)=> API.post('/articles/createArticle',newArticle)
export const updateArticle = (id,updatedArticle)=>API.patch(`/articles/${id}`,updatedArticle)
export const deleteArticle = (id)=>API.delete(`/articles/${id}`)
export const  likeArticle = (id)=>API.patch(`/articles/${id}/likeArticle`);
export const comment = (com,id)=>API.post(`/articles/${id}/commentArticle`,{com})
export const addBookmark = (id)=>API.patch(`/articles/bookmark/${id}`);

export const signIn = (formData)=>API.post('/users/signIn',formData)
export const signUp = (formData)=>API.post('/users/signUp',formData)
