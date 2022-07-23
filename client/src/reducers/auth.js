import {AUTH,LOGOUT,ADD_BOOKMARK} from '../constants/actionTypes.js';
const authReducer = (state = {authData:null},action)=>{
	if(action.type===AUTH){
		localStorage.setItem('profile',JSON.stringify({...action?.data}));
		return {...state,authData:action?.data};
	}
	else if(action.type===ADD_BOOKMARK){
		let profile = JSON.parse(localStorage.getItem('profile'));
		if(!profile.result['bookmarks']){
			profile['bookmarks'] = [action.payload];
			
		}
		else{
			profile.result.bookmarks.unshift(action.payload);
		}
		
		localStorage.setItem('profile',JSON.stringify(profile));
        return{...state,authData:profile}
	}
	else if(action.type===LOGOUT){
	
		localStorage.clear();

		return{...state,authData:null};
	}
	else{
		return state;
	}
}
export default authReducer;