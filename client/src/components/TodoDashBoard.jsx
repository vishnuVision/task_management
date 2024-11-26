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

function TodoDashBoard() {

  const { completedList, inCompletedList, inProgressList, refreshData, page, setPage } = useContext(getDetails);
  const { user } = useSelector(state => state.authReducer);
  const [isList, setIsList] = useState(true);
  const { users } = useContext(getDetails);

  const [subTask, setSubTask] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [isVisible, setIsVisible] = useState();
  const [todoData, setTodoData] = useState({});
  const [todoList, setTodoList] = useState([]);

  const getTodo = async () => {
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
          setTodoList([...data.filter(({priority})=>priority==="HIGH"),...data.filter(({priority})=>priority==="MEDIUM"),...data.filter(({priority})=>priority==="LOW")]);
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

  useEffect(() => {
    getTodo();
  }, [])

  useEffect(() => {
    refreshData(page);
  }, [page]);

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

  const getComments = async (id) => {
    if (id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/comments/${id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        })

        if (response.data) {
          const { success, message, data } = response.data;

          if (success) {
            setCommentsList(data);
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
    <div className="relative flex bg-[#ffffff] flex-col mt-16 lg:mt-20 ms-2 xl:ms-6 flex-grow justify-evenly">
      <div className="">
        <div className="flex items-center mx-2 mt-2 flex-wrap gap-2 mb-2">
          <img className="w-8 h-8 rounded-full" src={user?.avatar} alt="user image" />
          <h1 className="text-lg font-bold">My Tasks</h1>
        </div>
      </div>
      <div className="border-b-[1px] border-slate-300 mt-2 me-3 relative">
        <div className="mx-4 flex font-semibold gap-6 text-black">
          <div onClick={() => setIsList(true)} className={`flex items-center gap-1 cursor-pointer ${isList ? "border-b-2 border-black" : ""}`}>
            <i className="fa-solid fa-list-ul"></i>
            <p>List</p>
          </div>
          <div onClick={() => setIsList(false)} className={`flex items-center gap-1 cursor-pointer ${!isList ? "border-b-2 border-black" : ""}`}>
            <i className="fa-solid fa-cube"></i>
            <p>Board</p>
          </div>
        </div>
      </div>
      {
        isList && 
        <div className="relative flex flex-grow overflow-scroll w-[35%] xxs:w-[45%] xs:w-[60%] sm:w-[80%] md:w-[90%] lg:w-[95%] sm:mx-2 mt-4 h-screen md:mx-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
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
            <tbody className="">
              {todoList.map((task, index) => (
                <TableRow key={index} index={index} task={task} setIsVisible={setIsVisible} setTodoData={setTodoData} getComments={getComments} getSubTasks={getSubTasks} users={users} isVisible={isVisible} />
              ))}
            </tbody>
          </table>
        </div>
      }
      {
        !isList &&
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
        isVisible && <TodoDetails todoData={{ ...todoData, id: todoData._id }} refreshTodoData={getTodo} isSideBar={isVisible} setIsSideBar={setIsVisible} subTask={subTask} comments={commentsList} getComments={getComments} refreshsubTask={getSubTasks} />
      }
    </div>

  )
}

export default TodoDashBoard