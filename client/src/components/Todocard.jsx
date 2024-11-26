import PropTypes from "prop-types";
import TodoDialog from "../Dialog/TodoDialog";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getDetails from "../context/useContext";
import SubTask from "./SubTask";
import TodoDetails from "./TodoDetails";
import axios from "axios";
import toast from "react-hot-toast";
import { deassignComments, deassignSubTask } from "../redux/slices/notificationReducer";

function Todocard({ _id = "", title = "", description = "", priority = "", status = "", owner = []}) {
  // const { admin: isAdmin } = useSelector(state => state?.authReducer?.user);
  const { users } = useContext(getDetails);
  const { comments, subTodo } = useSelector(state => state.notificationReducer);
  const dispatch = useDispatch();

  // dialog state
  const [visibleSubTask, setVisibleSubTask] = useState(false);

  const [avatar, setAvatar] = useState([]);
  const [isSideBar, setIsSideBar] = useState(false);
  const [showSubTask, setShowSubTask] = useState(false);
  const [subTask, setSubTask] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [subTaskCount, setSubTaskCount] = useState(0);
  const [commentsList, setCommentsList] = useState([]);

  const getSubTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/subtodo/${_id}`, {
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

  const getComments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/comments/${_id}`, {
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

  useEffect(() => {
    const userDetails = owner.map((id) => {
      const user = users.find((user) => user._id === id);
      return { avatar: user?.avatar, username: user?.username };
    });
    setAvatar(userDetails);
    getSubTasks();
    getComments();
  }, [])

  useEffect(() => {
    if (comments.length > 0) {
      const data = comments.filter(({ todo }) => todo === _id);
      if (data.length > 0) {
        setCommentCount(data.length);
      }
      else {
        setCommentCount(0);
      }
    }
    else {
      setCommentCount(0);
    }
  }, [comments])

  useEffect(() => {
    if (subTodo.length > 0) {
      const data = subTodo.filter(({ todo }) => todo === _id);
      if (data.length > 0) {
        setSubTaskCount(data.length);
      }
      else {
        setSubTaskCount(0);
      }
    }
    else {
      setSubTaskCount(0);
    }
  }, [subTodo])

  useEffect(() => {
    if(isSideBar)
    {
      dispatch(deassignSubTask(_id));
      dispatch(deassignComments(_id));
    }
  }, [isSideBar])

  useEffect(()=>{
    if(showSubTask)
    {
      dispatch(deassignSubTask(_id));
    }
  },[showSubTask])

  return (
    <>
      <div className={`w-full box-content border shadow-lg border-slate-200 z-0 hover:border-slate-700 hover:z-0 hover:shadow-xl rounded-lg px-4 py-2 `}>
        <div className="">
          <div className="cursor-pointer p-2" onClick={() => setIsSideBar(prev => !prev)}>
            <div className="flex flex-wrap gap-2">
              <p className="font-bold ms-1">{title}</p>
            </div>
            <div className="flex -space-x-4 mt-2 items-center">
              {
                avatar && avatar.length > 0 && avatar.map(({ avatar, username }, idx) => (
                  <div key={idx} className="relative group">
                    <img src={avatar} className="w-10 h-10 rounded-full border-2 border-black" alt="User Avatar" />
                    <div className="absolute z-10  transform -translate-x-1 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {username}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="flex flex-row-reverse">
            <div onClick={() => setIsSideBar(prev => !prev)} className="relative group py-2 px-2">
              <button className="text-md font-thin text-slate-500"><i className="fa-regular fa-comment"></i></button>
              {
                commentCount > 0 &&
                <div className="absolute cursor-pointer top-0 left-4 z-10 bg-red-500 px-[6px] rounded-full">
                  <span>{commentCount}</span>
                </div>
              }
              <div className="absolute z-10  transform -translate-x-6 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Comment
              </div>
            </div>
            <div className="relative group z-20 py-2 px-2 max-w-100 overflow-hidden">
              <button onClick={() => setShowSubTask(prev => !prev)} className="text-md font-thin text-slate-500">
                {
                  showSubTask ? <i className="fa-solid fa-angle-up"></i> : <i className="fa-solid fa-angle-down"></i>
                }
              </button>
              {
                subTaskCount > 0 &&
                <div className="absolute cursor-pointer bottom-2 -translate-y-[2px] -left-1">
                  <span>{subTaskCount}</span>
                </div>
              }
              <div className="absolute z-10  transform -translate-x-6 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                SubTask
              </div>
            </div>
          </div>
          {
            showSubTask && <SubTask subTask={subTask} visible={visibleSubTask} setVisible={setVisibleSubTask} color={priority === "LOW" ? "blue" : priority === "MEDIUM" ? "red" : "green"} />
          }
        </div>
      </div>
      {
        isSideBar && <TodoDetails todoData={{ _id: _id, title, description, priority, status, avatar,owner }} isSideBar={isSideBar} setIsSideBar={setIsSideBar} subTask={subTask} comments={commentsList} getComments={getComments} refreshsubTask={getSubTasks} />
      }
      {
        visibleSubTask && <TodoDialog visible={visibleSubTask} setVisible={setVisibleSubTask} label={"Add New Subtask"} id={_id} mode="subTask" refreshSubTodoData={getSubTasks} />
      }
    </>

  )
}

Todocard.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.string,
  description: PropTypes.string,
  priority: PropTypes.string,
  visible: PropTypes.bool,
  setVisible: PropTypes.any,
  deleteVisible: PropTypes.bool,
  setDeleteVisible: PropTypes.any,
  owner: PropTypes.array,
  isSideBar:PropTypes.bool,
  setIsSideBar:PropTypes.any
}

export default Todocard
