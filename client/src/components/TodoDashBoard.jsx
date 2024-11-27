import { useContext, useEffect, useState } from "react";
import Statuscontainer from "./Statuscontainer";
import getDetails from "../context/useContext";
import { useSelector } from "react-redux";
import { v4 as uuid } from 'uuid';
import Pagination from "../features.jsx/Pagination";
import axios from "axios";
import toast from "react-hot-toast";
import TodoDetails from "./TodoDetails";
import TableRow from "./TableRow";
import { getSocket } from "../context/socketContext";
import Loading from "./Loading";

function TodoDashBoard() {

  const { completedList, inCompletedList, inProgressList, refreshData, page, setPage,isLoading } = useContext(getDetails);
  const { user } = useSelector(state => state.authReducer);
  const [isList, setIsList] = useState(true);
  const { users } = useContext(getDetails);

  const [subTask, setSubTask] = useState([]);
  const [isVisible, setIsVisible] = useState();
  const [todoData, setTodoData] = useState({});
  const [todoList, setTodoList] = useState([]);

  const [isLoadingList,setIsLoadingList] = useState(false);

  const [isFirst,setIsFirst] = useState(true);

  const {socket} = useContext(getSocket);

  useEffect(() => {
    if(socket)
    {
      socket.on("NEW_NOTIFICATION", () => {
        getTodo();
      })
  
      return () => {
        socket.off("NEW_NOTIFICATION");
      }
    }
  }, [socket])

  const getTodo = async () => {
    setIsLoadingList(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getAllTodosForList`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.data) {
        const { success, message, data } = response.data;
        if (success) {
          setTodoList([...data.filter(({ priority }) => priority === "HIGH"), ...data.filter(({ priority }) => priority === "MEDIUM"), ...data.filter(({ priority }) => priority === "LOW")]);
        }
        else {
          toast.error(message);
        }
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        toast.error(error.response.data.message);
      }
    }
    setIsLoadingList(false);
  }

  useEffect(() => {
    if (!isFirst) {
      refreshData(page);
    }
    else
    {
      setIsFirst(false);
    }
  }, [page]);

  useEffect(() => {
    if(isList)
    {
      getTodo();
    }
  }, [])

  const getSubTasks = async (id) => {
    if (id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/subtodo/${id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        })
        if (response.data) {
          const { success, message, data } = response.data;
          if (success) {
            setSubTask(data);
          }
          else {
            toast.error(message);
          }
        }
      } catch (error) {
        if (!error?.response?.data?.success) {
          toast.error(error.response.data.message);
        }
      }
    }
  }

  return (
    <div className="relative flex bg-[#ffffff] flex-col mt-16 lg:mt-20 w-screen justify-evenly">
      <div className="">
        <div className="flex items-center mx-2 mt-2 flex-wrap gap-2 mb-2">
          <img className="w-8 h-8 rounded-full" src={user?.avatar} alt="user image" />
          <h1 className="text-lg font-bold text-slate-700">My Tasks</h1>
        </div>
      </div>
      <div className="border-b-[1px] border-slate-300 mt-2 ms-2 me-3 relative">
        <div className="mx-4 flex font-semibold gap-4 text-slate-700">
          <div onClick={() => setIsList(true)} className={`flex items-center gap-1 px-4 cursor-pointer ${isList ? "border-b-2 border-slate-700" : ""}`}>
            <i className="fa-solid fa-list-ul"></i>
            <p>List</p>
          </div>
          <div onClick={() => setIsList(false)} className={`flex items-center gap-1 px-4 cursor-pointer ${!isList ? "border-b-2 border-slate-700" : ""}`}>
            <i className="fa-solid fa-cube"></i>
            <p>Board</p>
          </div>
        </div>
      </div>
      {
        isList &&
        <div className="overflow-scroll flex-grow mx-2 my-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
          <table className="table table-auto border-collapse border border-base-300">
            <thead>
              <tr className="bg-slate-200">
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Date</th>
              </tr>
            </thead>
            {
              todoList.length === 0 && (
                <tbody className="">
                  <tr className="">
                    <td colSpan={7} className="text-center">No Todos</td>
                  </tr>
                </tbody>
              )
            }
            {
              todoList.length > 0 &&
              <tbody className="">
                {todoList.map((task, index) => (
                  <TableRow key={index} index={index} task={task} setIsVisible={setIsVisible} setTodoData={setTodoData} getSubTasks={getSubTasks} users={users} isVisible={isVisible} />
                ))}
              </tbody>
            }
          </table>
        </div>
      }
      {
        !isList && !isLoading &&
        <>
          <div className="flex flex-wrap  flex-grow mx-8 gap-6 bg-[#ffffff]">
            <Statuscontainer title="Completed" length={completedList.length} todoList={completedList} />
            <Statuscontainer title="InProgress" length={inProgressList.length} todoList={inProgressList} />
            <Statuscontainer key={uuid()} title="InCompleted" length={inCompletedList.length} todoList={inCompletedList} />
          </div>
          <Pagination page={page} setPage={setPage} completedList={completedList} inCompletedList={inCompletedList} inProgressList={inProgressList} />
        </>
      }
      {
        isLoading && <Loading/>
      }
      {
        isLoadingList && <Loading/>
      }
      {
        isVisible && <TodoDetails todoData={{ ...todoData, id: todoData._id }} refreshTodoData={getTodo} isSideBar={isVisible} setIsSideBar={setIsVisible} subTask={subTask} refreshsubTask={getSubTasks} />
      }
    </div>

  )
}

export default TodoDashBoard