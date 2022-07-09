import {combineReducers} from 'redux';
import articles from './articles'
import authReducer from './auth';
export const reducers = combineReducers({articles,authReducer});