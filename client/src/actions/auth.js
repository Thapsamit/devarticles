import { AUTH,START_LOADING,END_LOADING } from "../constants/actionTypes";
import * as api from "../api/index.js";

export const signin = (formData, history) => async (dispatch) => {
  try {
    console.log("Start Loading...")
    dispatch({type:START_LOADING});
    const { data } = await api.signIn(formData);
   
    dispatch({ type: AUTH, data });
    dispatch({type:END_LOADING});
    console.log("End Loading...")
    history.push("/");
  } catch (e) {
    console.log(e);
  }
};
export const signup = (formData, history) => async (dispatch) => {
  try {
    console.log("Start loading...")
    dispatch({type:START_LOADING});
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });
    dispatch({type:END_LOADING})
    console.log("End Loading...")

    history.push("/");
  } catch (e) {
    // statements
    console.log(e);
  }
};
