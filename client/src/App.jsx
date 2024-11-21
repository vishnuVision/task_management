import toast, { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { Suspense, useEffect, useMemo } from "react";
import Loading from "./components/Loading";
import AppDashboard from "./components/AppDashboard";
import axios from "axios";
import Notfound from "./pages/Notfound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRouting from "./components/ProtectedRouting";
import { useDispatch } from "react-redux";
import { assignUser } from "./redux/slices/authReducer"
import UserTodos from "./pages/UserTodos";
import { io } from "socket.io-client";
import { getSocket } from "./context/socketContext";

function App() {
  const socket = useMemo(() => io(import.meta.env.VITE_SERVER_URL,{withCredentials:true}),[]);

  socket.on("connect", () => {
    console.log("connected");
  })


  const dispatch = useDispatch();

  const getUser = async () => { 
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getUser`,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
      })

      if(response.data)
      {
        const {success,data} = response.data;

        if(success)
        {
          dispatch(assignUser(data));
        }
      }
    } catch (error) {
      if(!error?.response?.data?.success)
      {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(()=>{
    getUser();
  },[]) 

  return (
    <getSocket.Provider value={{socket}}>
      <Router>
        <Suspense fallback={<Loading/>}>
          <Routes>
            <Route element={<ProtectedRouting/>}>
              <Route path="/" element={<AppDashboard><Home/></AppDashboard>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/userTodo/:userId" element={<UserTodos/>}/>
            <Route path="/userTodo" element={<UserTodos/>}/>
            <Route path="*" element={<Notfound/>}/>
          </Routes>
        </Suspense>
      </Router>
      <Toaster/>
    </getSocket.Provider>
  )
}

export default App
