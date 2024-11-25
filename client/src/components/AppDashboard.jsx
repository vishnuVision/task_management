import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import getDetails from "../context/useContext";
import { getSocket } from "../context/socketContext";
import { assignComments, assignNotification, assignSubTask } from "../redux/slices/notificationReducer";
import { io } from "socket.io-client";

function AppDashboard({ children }) {

  const { user } = useSelector(state => state.authReducer);
  const [completedList, setCompletedList] = useState([]);
  const [inCompletedList, setInCompletedList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const socket = useMemo(() => io(import.meta.env.VITE_SERVER_URL, { withCredentials: true }), []);
  const dispatch = useDispatch();

  const getTodos = async (page = 1) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getTodos/${page}`, { withCredentials: true });
      if (response.data) {
        const { success, data } = response.data;
        if (data.length === 0) {
          setLoadMessage("No more todos");
          setPage(1);
        }
        else {
          setLoadMessage("");
        }

        if (success) {
          setTodoList(data);
          setCompletedList(data?.filter(({ status }) => status === "COMPLETED"));
          setInCompletedList(data?.filter(({ status }) => status === "INCOMPLETED"));
          setInProgressList(data?.filter(({ status }) => status === "INPROGRESS"));
        }
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
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

  const getAllNotification = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/notification`, { withCredentials: true });
      if (response.data) {
        const { success, data } = response.data;
        if (success && data.length > 0) {
          data.map((notification) => {
            dispatch(assignNotification(notification))
          });
        }
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    getAllUser();
    getAllNotification();
  }, [])

  useEffect(() => {
    if (user) {
      getTodos();
    }
  }, [user])

  useEffect(() => {
    socket.on("connect");
    socket.on("NEW_COMMENT", (data) => {
      dispatch(assignComments(data));
    });

    socket.on("NEW_SUBTASK", (data) => {
      dispatch(assignSubTask(data));
    })

    socket.on("NEW_NOTIFICATION", (data) => {
      dispatch(assignNotification(data))
      getTodos();
    })

    return () => {
      socket.off("NEW_COMMENT");
      socket.off("NEW_SUBTASK");
      socket.off("NEW_NOTIFICATION");
      socket.on("disconnect");
    }
  }, [socket])

  return (
    <getSocket.Provider value={{ socket }}>
      <getDetails.Provider value={{ refreshData: getTodos, completedList, inCompletedList, inProgressList, loading, setLoading, loadMessage, page, setPage, users,todoList }}>
        <div className="flex flex-col">
          <Topbar />
          <div className="flex flex-row h-full overflow-x-hidden overflow-y-auto">
            <Sidebar />
            {children}
          </div>
        </div>
      </getDetails.Provider>
    </getSocket.Provider>
  );
}

AppDashboard.propTypes = {
  children: PropTypes.any
};

export default AppDashboard;


