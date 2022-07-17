import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  FETCH_BY_SEARCH,
  START_LOADING,
  END_LOADING,
  FETCH_ARTICLE,
  COMMENT,
  LIKE,
  FETCH_BY_CATEGORY
} from "../constants/actionTypes";

const articles = (state = { isLoading: true, articles: [] }, action) => {
  if (action.type === FETCH_ALL) {
    console.log(action.payload.data);
    return { ...state, articles: action.payload.data };
  } else if (action.type === FETCH_ARTICLE) {
    return { ...state, article: action.payload.article };
  } else if (action.type === CREATE) {
    return { ...state, articles: [...state.articles, action.payload] };
  } else if (action.type === UPDATE) {
    return {
      ...state,
      articles: state.articles.map((article) =>
        article._id === action.payload._id ? action.payload : article
      ),
    };
  }
  else if(action.type===LIKE){
    return{
      ...state,
      articles:state.articles.map((article)=>(article._id===action.payload._id?action.payload:article))
    }
  }
  else if (action.type === DELETE) {
    return {
      ...state,
      articles: state.articles.filter(
        (article) => article._id !== action.payload
      ),
    };
  } else if (action.type === FETCH_BY_SEARCH) {
    return { ...state, articles: action.payload.data };
  }
   else if(action.type === FETCH_BY_CATEGORY){
    return{
      ...state,
      articles:action.payload.data
    }
   }
   else if (action.type === START_LOADING) {
    return {
      ...state,
      isLoading: true,
    };
  } else if (action.type === END_LOADING) {
    return {
      ...state,
      isLoading: false,
    };
  }
  else if(action.type===COMMENT){
    return{
      ...state,
      articles:state.articles.map((article)=>{
        if(article._id===action.payload._id){
          return action.payload;
        }
        return article;
      })
    }
  }
  else {
    return state;
  }
};

export default articles;
