import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import FileInput from "../components/FileInput";
import toast from "react-hot-toast";
import axios from "axios";
import PropTypes from "prop-types";

function Register({admin=false}) {
  const { user } = useSelector(state => state.authReducer);
  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [avatar,setAvatar] = useState("");
  const [error,setError] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    let toastId = toast.loading("User Creating...");
    if(!username || !name || !email || !password || !avatar)
    {
      setError("Please fill all fields");
    }
    else
    {
      const formdata = new FormData();
      formdata.append("username",username);
      formdata.append("name",name);
      formdata.append("email",email);
      formdata.append("password",password);
      formdata.append("avatar",avatar);
      formdata.append("admin",admin);

      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/register`, formdata);

        if(response.data)
        {
          const {success,message} = response.data;

          if(success)
          {
            toast.success(message+" please Login", {id:toastId});
            navigate("/login");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Register User</h2>

        <form onSubmit={handlesubmit}>
          <Input label="Username" type="text" name="username" placeholder="Enter username" value={username} setValue={setUsername} />
          <Input label="Name" type="text" name="name" placeholder="Enter Name" value={name} setValue={setName} />
          <Input label="Email" type="email" name="email" placeholder="Enter Email" value={email} setValue={setEmail} />
          <Input label="Password" type="password" name="password" placeholder="Enter Password" value={password} setValue={setPassword} />
          <FileInput label="Avatar" name="avatar" placeholder="Choose File" setValue={setAvatar} />
          <div>
            <p className="text-red-600 mb-4 font-medium">{error}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-8">
          <p className="text-md" to={"/register"}>Already have an account? <Link className="text-blue-600 font-semibold" to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}

Register.propTypes = {
  admin:PropTypes.bool
}

export default Register
