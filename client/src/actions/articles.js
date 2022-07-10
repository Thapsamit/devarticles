import * as api from "../api";
import {
  FETCH_ALL,
  FETCH_BY_SEARCH,
  CREATE,
  UPDATE,
  DELETE,
  START_LOADING,
  END_LOADING,
  FETCH_ARTICLE,
} from "../constants/actionTypes";
//Action creators
//asynchronus approach
export const getArticle = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data
    } = await api.fetchArticle(id);
    console.log(data);
    dispatch({ type: FETCH_ARTICLE, payload: { article:data } });
    dispatch({ type: END_LOADING });
  } catch (err) {
    console.log(err.message);
  }
};
export const getArticles = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchArticles();
    console.log(data);
    dispatch({ type: FETCH_ALL, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (err) {
    console.log(err.message);
  }
};

export const createArticle = (article) => async (dispatch) => {
  try {
    const { data } = await api.createArticle(article);
    dispatch({ type: CREATE, payload: data });
  } catch (err) {
    console.log(err);
  }
};
export const updateArticle = (id, article) => async (dispatch) => {
  try {
    const { data } = await api.updateArticle(id, article);
    dispatch({ type: UPDATE, payload: data });
  } catch (err) {
    console.log(err);
  }
};
export const deleteArticle = (id) => async (dispatch) => {
  try {
    await api.deleteArticle(id);
    dispatch({ type: DELETE, payload: id });
  } catch (err) {
    console.log(err);
  }
};
export const likeArticle = (id) => async (dispatch) => {
  try {
    const { data } = await api.likeArticle(id);
    dispatch({ type: UPDATE, payload: { data } });
  } catch (err) {
    console.log(err);
  }
};
export const getArticlesBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchArticlesBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (err) {
    console.log(err);
  }
};
