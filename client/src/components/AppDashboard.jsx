import { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import getDetails from "../context/useContext";
import { getSocket } from "../context/socketContext";

function AppDashboard({ children }) {

  const {user} = useSelector(state=>state.authReducer);
  const [completedList,setCompletedList] = useState([]);
  const [inCompletedList,setInCompletedList] = useState([]);
  const [inProgressList,setInProgressList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [loadMessage,setLoadMessage] = useState("");
  const [page,setPage] = useState(1);
  const [users,setUsers] = useState([]);
  const { socket } = useContext(getSocket);

  const getTodos = async (page=1) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getTodos/${page}`,{withCredentials:true});  
        if(response.data)
        {
          const {success,data} = response.data;
          if(data.length === 0)
          {
            setLoadMessage("No more todos");
            setPage(1);
          }
          else
          {
            setLoadMessage("");
          }
  
          if(success)
            {
              setCompletedList(data?.filter(({ status }) => status === "COMPLETED"));
              setInCompletedList(data?.filter(({ status }) => status === "INCOMPLETED"));
              setInProgressList(data?.filter(({ status }) => status === "INPROGRESS"));
            }
        }
      } catch (error) {
        if(!error?.response?.data?.success)
        {
          toast.error(error.response.data.message);
        }
      }
    setLoading("");
  }

  const getAllUser = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getallusers`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response?.data) {
            const { data, success } = response.data;
            if (success) {
                setUsers(data);
            }
        }
    } catch (error) {
        if (!error?.response?.data?.success) {
            toast.error(error.response.data.message);
        }
    }
  }

  useEffect(()=>{
    getAllUser();
  },[])

  useEffect(()=>{
    if(user)
    {
      getTodos();
    }
  },[user])

  useEffect(()=>{
    socket.on("NEW_COMMENT", (data) => {
          console.log(data);
    });
  },[socket])

  return (
    <getDetails.Provider value={{refreshData:getTodos,completedList,inCompletedList,inProgressList,loading,setLoading,loadMessage,page,setPage,users}}>
      <div className="flex flex-grow">
        <Sidebar />
        <div className="w-screen sm:w-full">
          <div className="flex flex-col h-full flex-grow overflow-x-hidden overflow-y-auto flex-wrap">
              <Topbar />
              {children}
          </div> 
        </div>
      </div>
    </getDetails.Provider>
  );
}

AppDashboard.propTypes = {
  children: PropTypes.any
};

export default AppDashboard;


