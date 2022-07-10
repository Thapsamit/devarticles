import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { signup, signin } from "../../actions/auth";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const initialState = { name: "", email: "", password: "" };
const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (isSignUp) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const switchAuthComponent = () => {
    setIsSignUp(!isSignUp);
  };
  const googleSuccess = (res) => {
    console.log(res);
  };
  const googleFailure = (err) => {
    console.log(err);
  };

  return (
    <div className="box">
      <div className="w-full flex justify-center">
        <div className="bg-darkBg mt-[2.5rem] mb-[2rem] border-mainColor border rounded-md shadow-md py-[20px] w-3/4 md:w-2/5">
          <div>
            <div className="border-b border-primaryText1 text-center">
              <h1 className="uppercase text-mainColor text-[1.3rem] pb-2">
                {isSignUp ? "SIGN UP" : "LOGIN"}
              </h1>
            </div>
            <div className="py-[20px] px-[30px]">
              <form onSubmit={handleSubmit}>
                {isSignUp && (
                  <div className="my-[15px]">
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter Name..."
                      required
                      className="custom-input"
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="my-[15px]">
                  <input
                    name="email"
                    type="email"
                    required
                    className="custom-input"
                    placeholder="Enter Email.."
                    onChange={handleChange}
                  />
                </div>

                <div className="my-[15px]">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="custom-input"
                    placeholder="Enter Password..."
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn block w-full">
                  {isSignUp ? "Sign Up" : "Login"}
                </button>
                {/*!isSignUp &&(   <button className="btn block w-full">Sign In With Google </button>)*/}
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onError={googleFailure}
                />

                <button
                  className="btn btn-gray block w-full"
                  onClick={switchAuthComponent}
                >
                  {isSignUp
                    ? "Already Have an Account? Sign In"
                    : "Don't Have account? Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Auth;
