import { useContext, useEffect, useState } from "react";
import Statuscontainer from "./Statuscontainer";
import getDetails from "../context/useContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { assignUser } from "../redux/slices/authReducer";
import { v4 as uuid } from 'uuid';
import Pagination from "../features.jsx/Pagination";

function TodoDashBoard() {

  const { completedList, inCompletedList, inProgressList, refreshData, page ,setPage } = useContext(getDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.authReducer);

  const [showMenu,setShowMenu] = useState(false);

  useEffect(()=>{
    refreshData(page);
  },[page])

  const logout = async () => {
    let toastId = toast.loading("User logout...");
    try {
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/logout`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.data) {
        const { success, message } = response.data;

        if (success) {
          toast.success(message, { id: toastId });
          dispatch(assignUser(false));
          navigate("/login");
        }
        else {
          toast.error(message, { id: toastId });
        }
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        toast.error(error.response.data.message, { id: toastId });
      }
    }
  }

  return (
    <div className="flex flex-col mt-16 flex-grow justify-evenly">
      <div>
        <div className="flex justify-between mx-4 mt-2 flex-wrap gap-2 mb-2">
          <h1 className="text-lg md:text-2xl font-bold"><span className="text-red-400">Welcome, </span>{user?.name}</h1>
          <div className="relative py-1 px-3 md:py-2 md:px-4 rounded">
            <button onClick={()=>{setShowMenu(prev=>!prev)}} className="flex gap-1 hover:opacity-50 justify-center items-center text-xl"><img data-tooltip-target="tooltip-default" src={user?.avatar} className="w-8 h-8 rounded-full" alt="User Avatar" /> <i className="fa-solid fa-chevron-down"></i></button>
            {
              showMenu && <div className="absolute z-10 -left-3/4 transform -translate-x-1 -bottom-15 mb-2 w-40 shadow-lg bg-slate-50 hover:bg-slate-100  text-white text-sm px-3 py-2 rounded transition-opacity duration-300">
                              <button onClick={logout} className=" text-black text-lg font-bold py-1 px-2 rounded flex gap-2 items-center"><i className="fa-solid fa-arrow-right"></i> Logout</button>
                          </div>
            }
          </div>
        </div>
      </div>  
      <div className="flex flex-wrap flex-grow justify-evenly mx-4">
        <Statuscontainer title="Completed" length={completedList.length} todoList={completedList} />
        <Statuscontainer title="InProgress" length={inProgressList.length} todoList={inProgressList} />
        <Statuscontainer key={uuid()} title="InCompleted" length={inCompletedList.length} todoList={inCompletedList} />
      </div>
      <Pagination page={page} setPage={setPage} completedList={completedList} inCompletedList={inCompletedList} inProgressList={inProgressList}/>
    </div>

  )
}

export default TodoDashBoard