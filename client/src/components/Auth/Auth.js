import {useState} from 'react';
import { GoogleLogin } from '@react-oauth/google'
import {signup,signin} from '../../actions/auth';
import {useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
const initialState = {name:'',email:'',password:''}
const Auth = ()=>{
	const [showPassword,setShowPassword ]= useState(false);
    const [isSignUp,setIsSignUp] = useState(false)
    const [formData,setFormData] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()
    const handleSubmit = (e)=>{
          e.preventDefault();
           console.log(formData)
           if(isSignUp){
                dispatch(signup(formData,history))
           }
           else{
                 dispatch(signin(formData,history))
           }
    }
    const handleChange = (e)=>{
          e.preventDefault();
          setFormData({...formData,[e.target.name]:e.target.value})
    }
    const switchAuthComponent = ()=>{
        setIsSignUp(!isSignUp)
    }
    const googleSuccess = (res)=>{
        
        console.log(res)
      
    }
    const googleFailure = (err)=>{
        console.log(err)
    }
    
	return(
            <div className="box">
                  <div className="w-full flex justify-center">
                            <div className="bg-white mt-[2rem] mb-[2rem] rounded-md shadow-md py-[20px] px-[20px] w-3/4 md:w-2/5">
                                     <div className="text-center py-[20px] px-[20px]">
                                           <h1>{isSignUp?'SIGN UP':'SIGN IN'}</h1>
                                           <form  onSubmit={handleSubmit}>
                                           {isSignUp && (
                                                      <div  className="my-[10px]">

                                                          <input name="name" type="text" placeholder="Enter Name..." required className="bg-gray-200 p-[15px] text-md" onChange={handleChange}/>
                                                    </div>
                                            )}   
                                                     <div  className="my-[10px]">
                                                            <input name="email" type="email" required className="bg-gray-200 p-[15px] text-md" placeholder="Enter Email.." onChange={handleChange}/>
                                                     </div>
                                                     
                                                     <div  className="my-[10px]">
                                                             <input name="password" type={showPassword ? "text" :"password"} className="bg-gray-200 p-[15px] text-md" placeholder="Enter Password..." onChange={handleChange}/>
                                                     </div>

                                                     <button type="submit" className="btn block w-full">{isSignUp?"Sign Up":"Sign In"}</button>
                                                     {/*!isSignUp &&(   <button className="btn block w-full">Sign In With Google </button>)*/ }
                                                      <GoogleLogin
                                                            onSuccess={googleSuccess}
                                                            onError={googleFailure}
                                                        />

                                                     <button className="btn block w-full" onClick={switchAuthComponent}>{isSignUp?"Already Have an Account? Sign In":"Don't Have account? Sign Up"}</button>
                                                  

                                           </form>
                                     </div>
                            </div>
                  </div>
            </div>
		)
}
export default Auth