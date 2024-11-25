import { useContext, useEffect, useState } from "react";
import Statuscontainer from "./Statuscontainer";
import getDetails from "../context/useContext";
import { useSelector } from "react-redux";
import { v4 as uuid } from 'uuid';
import Pagination from "../features.jsx/Pagination";
import axios from "axios";
import toast from "react-hot-toast";
import TodoDetails from "./TodoDetails";

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

  const handleSideBar = (task) => {
    if (isVisible) {
      setIsVisible(false);
      setTodoData([]);
    }
    else {
      const owner = task?.owner;
      const userDetails = owner.map((id) => {
        const user = users.find((user) => user._id === id);
        return { avatar: user?.avatar, username: user?.username };
      });
      setTodoData({...task,avatar:userDetails});
      setIsVisible(true);
      getComments(task._id)
      getSubTasks(task._id);
    }
  }

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
    console.log(id);
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
            // setCommentCount(data.filter(({show})=>show===false).length);
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
    <div className="relative flex flex-col mt-20 ms-2 flex-grow justify-evenly">
      <div className="mt-2">
        <div className="flex items-center mx-4 mt-2 flex-wrap gap-2 mb-2">
          <img className="w-10 h-10 rounded-full" src={user?.avatar} alt="user image" />
          <h1 className="text-lg md:text-2xl font-bold">My Tasks</h1>
        </div>
      </div>
      <div className="border-b-[1px] border-black mt-2 mx-2 relative">
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
        <div className="relative flex flex-grow overflow-scroll w-[40%] xxs:w-[50%] xs:w-[50%] sm:w-[90%] md:w-[90%] lg:w-[95%] my-4 mx-2 sm:mx-5 md:mx-10">
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
                <tr
                  key={index}
                  className="hover:bg-slate-200 cursor-pointer"
                  onClick={() => handleSideBar(task)}
                >
                  <th>{index + 1}</th>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td
                    className={`${task.status === "Completed" && "line-through"
                      } ${task.status === "Pending" && "text-error"} ${task.status === "Ongoing" && "text-warning"
                      }`}
                  >
                    {task.status}
                  </td>
                  <td
                    className={`${task.type === "Important" && "text-info"} ${task.type === "Normal" &&
                      "text-gray-900 dark:text-gray-400"
                      }`}
                  >
                    {task.priority}
                  </td>
                  <td>
                    <div className="flex -space-x-4 mt-2 items-center">
                      {task.owner.map((id) => {
                        const user = users.find((user) => user._id === id);
                        return <div key={id} className="relative group">
                          <img src={user?.avatar} className="w-10 h-10 rounded-full border-2 border-black" alt="User Avatar" />
                          <div className="absolute z-10  transform -translate-x-1 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {user?.username}
                          </div>
                        </div>
                      })}
                    </div>

                  </td>
                  <td>
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {
        !isList &&
        <>
          <div className="flex flex-wrap justify-evenly flex-grow mx-8 gap-4">
            <Statuscontainer title="Completed" length={completedList.length} todoList={completedList} />
            <Statuscontainer title="InProgress" length={inProgressList.length} todoList={inProgressList} />
            <Statuscontainer key={uuid()} title="InCompleted" length={inCompletedList.length} todoList={inCompletedList} />
          </div>
          <Pagination page={page} setPage={setPage} completedList={completedList} inCompletedList={inCompletedList} inProgressList={inProgressList} />
        </>
      }
      {
        isVisible && <TodoDetails todoData={{ ...todoData, id: todoData._id }} isSideBar={isVisible} setIsSideBar={setIsVisible} subTask={subTask} comments={commentsList} getComments={getComments} refreshsubTask={getSubTasks} />
      }
    </div>

  )
}

export default TodoDashBoard