import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { assignUser } from "../redux/slices/authReducer"

function Login() {
  const { user } = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [isAdmin,setIsAdmin] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    let toastId = toast.loading("User Creating...");
    if(!email || !password)
    {
      setError("Please fill all fields");
    }
    else
    {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/login`,{email,password,admin:isAdmin},{
          withCredentials:true,
          headers:{
              "Content-Type":"application/json"
          }
        })
  
        if(response.data)
        {
          const {success,message,data} = response.data;
  
          if(success)
          {
            toast.success(message, {id:toastId});
            dispatch(assignUser(data));
            navigate("/");
          }
          else
          {
            toast.error(message, {id:toastId});
          }
        }
      } catch (error) {
        if(!error?.response?.data?.success)
        {
          toast.error(error.response.data.message, {id:toastId});
        }
      }
    }
  }

  if (user) {
    return <Navigate to="/" />
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto p-6 bg-white rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login User</h2>

        <form onSubmit={handlesubmit}>
          <Input label="Email" type="email" name="email" placeholder="Enter Email" value={email} setValue={setEmail}/>
          <Input label="Password" type="password" name="password" placeholder="Enter Password" value={password} setValue={setPassword}/>
          <div className="flex flex-row gap-4 items-center">
              <input
              type="checkbox"
              value={isAdmin}
              onChange={()=>setIsAdmin(prev=>!prev)}
              className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <label htmlFor={name} className="block text-sm font-medium text-gray-700">Login as Admin</label>
          </div>
          <div>
            <p className="text-red-600 mb-4 font-medium">{error}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-8">
          <p className="text-md" to={"/register"}>Do not have an account? <Link className="text-blue-600 font-semibold" to="/register">Sign Up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
