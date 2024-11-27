import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import UserCard from "../components/UserCard";
import Statuscontainer from "../components/Statuscontainer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "../features.jsx/Pagination";
import { useDispatch, useSelector } from "react-redux";
import getDetails from "../context/useContext";
import { io } from "socket.io-client";
import { assignComments, assignNotification, assignSubTask } from "../redux/slices/notificationReducer";
import TableRow from "../components/TableRow";
import TodoDetails from "../components/TodoDetails";

function UserTodos() {
    const { admin } = useSelector(state => state.authReducer.user);
    const { users } = useSelector(state => state.authReducer);
    const { userId } = useParams();

    const [page, setPage] = useState(1);
    const [completedList, setCompletedList] = useState([]);
    const [inCompletedList, setInCompletedList] = useState([]);
    const [inProgressList, setInProgressList] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [todoList, setToDoList] = useState([]);
    const [isList, setIsList] = useState(true);
    const [allUsers, setAllUsers] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const [todoData, setTodoData] = useState({});
    const navigate = useNavigate();
    const socket = useMemo(() => io(import.meta.env.VITE_SERVER_URL, { withCredentials: true }), []);
    const dispatch = useDispatch();

    const [commentsList, setCommentsList] = useState([]);
    const [subTask, setSubTask] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.on("NEW_COMMENT", (data) => {
                dispatch(assignComments(data));
            });

            socket.on("NEW_SUBTASK", (data) => {
                dispatch(assignSubTask(data));
            })

            socket.on("NEW_NOTIFICATION", (data) => {
                dispatch(assignNotification(data))
            })
        }

        return () => {
            if (socket) {
                socket.off("NEW_COMMENT");
                socket.off("NEW_SUBTASK");
                socket.off("NEW_NOTIFICATION");
            }
        }
    }, [socket])

    useEffect(() => {
        if (!admin) {
            return navigate("/");
        }
        else {
            setAllUsers(users.filter(({ admin }) => admin === false));
        }
    }, [])

    useEffect(() => {
        if (userId) {
            if (isList) {
                getUserTodosForList();
            }
            else {
                getUserTodos();
            }
        }
    }, [userId, page, isList])

    const getUserTodos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getAllTodos/${userId}/${page}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response?.data) {
                const { success, data } = response.data;

                if (success) {
                    if (data.length === 0) {
                        setPage(1);
                    }
                    else {
                        setCompletedList(data?.filter(({ status }) => status === "COMPLETED"));
                        setInCompletedList(data?.filter(({ status }) => status === "INCOMPLETED"));
                        setInProgressList(data?.filter(({ status }) => status === "INPROGRESS"));
                    }
                }
            }
        } catch (error) {
            if (!error?.response?.data?.success) {
                toast.error(error.response.data.message);
            }
        }
    }

    const getUserTodosForList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getAllTodosForList/${userId}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response?.data) {
                const { success, data } = response.data;

                if (success) {
                    if (data.length === 0) {
                        setPage(1);
                    }
                    else {
                        setToDoList([...data.filter(({ priority }) => priority === "HIGH"), ...data.filter(({ priority }) => priority === "MEDIUM"), ...data.filter(({ priority }) => priority === "LOW")]);
                    }
                }
            }
        } catch (error) {
            if (!error?.response?.data?.success) {
                toast.error(error.response.data.message);
            }
        }
    }

    const getSubTasks = async (id) => {
        if (id) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getUsersubtodo/${id}`, {
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

        <getDetails.Provider value={{ completedList, inCompletedList, inProgressList, refreshData: getUserTodos, page, setPage, users }}>
            <div className="h-screen w-full flex flex-grow flex-row">
                <div className={`bg-slate-100 fixed lg:block w-64 h-screen overflow-y-scroll ${isMobile ? "fixed top-0 z-50 block" : "hidden"}`}>
                    <div className="flex justify-end mx-4 mb-4 mt-2">
                        <button className={isMobile ? "text-4xl" : "hidden"} onClick={() => setIsMobile(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    {
                        allUsers && allUsers.length > 0 && allUsers.map((user) => (
                            <UserCard key={user._id} className={`${userId === user._id ? "bg-slate-300" : ""}`} user={user} />
                        ))
                    }
                </div>
                <div className="lg:hidden block">
                    <button onClick={() => setIsMobile(prev => !prev)} className="absolute right-5 top-5 text-2xl">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>

                <div className="w-full flex flex-col flex-grow p-4 ms-0 lg:ms-64">
                    <div className="m-2">
                        <Link to={"/"} className="bg-slate-200 py-2 px-4 rounded-full"><i className="fa-solid fa-arrow-left"></i></Link>
                        <div className="border-b-[1px] border-slate-300 mt-5 relative">
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
                    </div>
                    {
                        !userId && (
                            <div className="flex flex-grow justify-center items-center">
                                <p className="font-semibold text-xl">Please select user</p>
                            </div>
                        )
                    }
                    {
                        userId && isList && (
                            <div className="relative flex overflow-scroll w-[95%] lg:w-[95%] my-4 mx-2 sm:mx-5 md:mx-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
                                <table className="table table-auto border-collapse border border-base-300">
                                    <thead>
                                        <tr className="bg-base-200">
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
                        )
                    }
                    {
                        userId && !isList && (
                            <div className="flex flex-wrap flex-grow gap-6 overflow-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
                                <Statuscontainer title="Completed" length={completedList.length} todoList={completedList} />
                                <Statuscontainer title="InProgress" length={inProgressList.length} todoList={inProgressList} />
                                <Statuscontainer title="InCompleted" length={inCompletedList.length} todoList={inCompletedList} />
                            </div>
                        )
                    }
                    {
                        (userId && !isList) && <Pagination page={page} setPage={setPage} completedList={completedList} inCompletedList={inCompletedList} inProgressList={inProgressList} />
                    }
                </div>
                {
                    isVisible && isList && <TodoDetails todoData={{ ...todoData, id: todoData._id }} isSideBar={isVisible} setIsSideBar={setIsVisible} subTask={subTask} comments={commentsList} getComments={getComments} refreshsubTask={getSubTasks} refreshTodoData={getUserTodosForList}/>
                }
                {
                    isVisible && !isList && <TodoDetails todoData={{ ...todoData, id: todoData._id }} isSideBar={isVisible} setIsSideBar={setIsVisible} subTask={subTask} comments={commentsList} getComments={getComments} refreshsubTask={getSubTasks} refreshTodoData={getUserTodos}/>
                }
            </div>
        </getDetails.Provider>

    )
}

export default UserTodos
