import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserCard from "../components/UserCard";
import Statuscontainer from "../components/Statuscontainer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "../features.jsx/Pagination";
import { useSelector } from "react-redux";
import getDetails from "../context/useContext";
// import { assignComments, assignNotification, assignSubTask } from "../redux/slices/notificationReducer";

function UserTodos() {
    const { admin } = useSelector(state => state.authReducer.user);
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [completedList, setCompletedList] = useState([]);
    const [inCompletedList, setInCompletedList] = useState([]);
    const [inProgressList, setInProgressList] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    // const socket = useSelector(state=>state.notificationReducer.socket) || null;
    // const dispatch = useDispatch();

    // console.log(socket)

    // useEffect(() => {
    //     console.log(socket);
    //     if(socket)
    //     {
    //         socket.on("NEW_COMMENT", (data) => {
    //             dispatch(assignComments(data));
    //           });
          
    //           socket.on("NEW_SUBTASK", (data) => {
    //             dispatch(assignSubTask(data));
    //           })
          
    //           socket.on("NEW_NOTIFICATION", (data) => {
    //             dispatch(assignNotification(data))
    //           })
    //     }
        
    //     return () => {
    //         if(socket)
    //         {
    //             socket.off("NEW_COMMENT");
    //             socket.off("NEW_SUBTASK");
    //             socket.off("NEW_NOTIFICATION");
    //         }
    //     }
    //   }, [socket])

    useEffect(() => {
        if (!admin) {
            return navigate("/");
        }
        else {
            getAllUser();
        }
    }, [])

    useEffect(() => {
        if (userId) {
            getUserTodos();
        }
    }, [userId, page])

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
                    setUsers(data.filter(({admin})=>admin===false));
                }
            }
        } catch (error) {
            if (!error?.response?.data?.success) {
                toast.error(error.response.data.message);
            }
        }
    }

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

    return (
        <getDetails.Provider value={{ completedList, inCompletedList, inProgressList, refreshData: getUserTodos, page, setPage ,users }}>
            <div className="h-screen w-full flex flex-row">
                <div className={`bg-slate-100 fixed md:block w-64 h-screen overflow-y-scroll ${isMobile ? "fixed top-0 z-50 block" : "hidden"}`}>
                    <div className="flex justify-end mx-4 mb-4 mt-2">
                        <button className={isMobile ? "text-4xl" : "hidden"} onClick={() => setIsMobile(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    {
                        users && users.length > 0 && users.map((user) => (
                            <UserCard key={user._id} className={`${userId === user._id ? "bg-slate-300" : ""}`} user={user} />
                        ))
                    }
                </div>
                <div className="md:hidden block">
                    <button onClick={() => setIsMobile(prev => !prev)} className="absolute right-5 top-5 text-2xl">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>
                <div className="flex flex-col flex-grow p-4 ms-0 md:ms-64">
                    <div className="m-2">
                        <Link to={"/"} className="bg-slate-200 py-2 px-4 rounded-full"><i className="fa-solid fa-arrow-left"></i></Link>
                    </div>
                    {
                        !userId && (
                            <div className="flex flex-grow justify-center items-center">
                                <p className="font-semibold text-xl">Please select user</p>
                            </div>
                        )
                    }
                    {
                        userId && (
                            <div className="flex flex-wrap flex-grow gap-6">
                                <Statuscontainer title="Completed" length={completedList.length} todoList={completedList} />
                                <Statuscontainer title="InProgress" length={inProgressList.length} todoList={inProgressList} />
                                <Statuscontainer title="InCompleted" length={inCompletedList.length} todoList={inCompletedList} />
                            </div>
                        )
                    }
                    {
                        userId && <Pagination page={page} setPage={setPage} completedList={completedList} inCompletedList={inCompletedList} inProgressList={inProgressList} />
                    }
                </div>
            </div>
        </getDetails.Provider>

    )
}

export default UserTodos
