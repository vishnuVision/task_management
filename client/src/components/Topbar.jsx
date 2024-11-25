import { useContext, useEffect, useState } from "react"
import TodoDialog from "../Dialog/TodoDialog";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../Dialog/Notification";
import toast from "react-hot-toast";
import axios from "axios";
import { assignUser } from "../redux/slices/authReducer";
import { resetLocalData } from "../redux/slices/notificationReducer";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../context/socketContext";

function Topbar() {
  const [visible, setVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { admin: isAdmin } = useSelector(state => state?.authReducer?.user);
  const user = useSelector(state => state?.authReducer?.user);
  const { notification } = useSelector(state => state.notificationReducer);
  const [notificationCount, setNotificationCount] = useState(notification.length);
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { socket } = useContext(getSocket);

  useEffect(() => {
    setNotificationCount(notification.length);
  }, [notification])

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
          dispatch(resetLocalData());
          navigate("/login");
          socket.emit("LOGOUT", () => {
            console.log("Disconnected from server");
          });
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
    <>
      <div className="flex flex-row bg-slate-900 text-white justify-between fixed w-full z-10">
        <div className="flex justify-center items-center sm:text-lg text-md font-extrabold lg:text-md ms-4 py-4">
          Task manager
        </div>
        <div className={`md:flex md:flex-row ${isMobile ? "fixed top-0 right-0 z-50 bg-slate-900 w-full block" : "hidden"}`}>
          <div className="flex flex-row justify-between items-center">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input type="checkbox" className="theme-controller" value="synthwave" />

              {/* sun icon */}
              <svg
                className="swap-off h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path
                  d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
              <svg
                className="swap-on h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path
                  d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
            <div onClick={() => setNotificationVisible(prev => !prev)} className={`relative group py-4 hover:bg-slate-700 px-6 cursor-pointer ${isMobile ? "" : "border-r-[1px] border-l-[1px] border-slate-300"}`}>
              <button className="text-3xl"><i className="fa-regular fa-bell"></i></button>
              <div className="absolute cursor-pointer top-2 left-6 md:left-8 lg:left-9 z-10 bg-red-500 px-[6px] rounded-full">
                <span>{notificationCount}</span>
              </div>
              {
                notificationVisible && <Notification setVisible={setNotificationVisible} isMobile={isMobile} />
              }
            </div>
            {
              isMobile && <div className="pe-4 md:hidden">
                <button onClick={() => setIsMobile(false)} className="text-3xl"><i className="fa-solid fa-xmark"></i></button>
              </div>
            }
          </div>
          {
            isAdmin &&
            <div onClick={() => setVisible(prev => !prev)} className={`hover:bg-slate-700 py-4 px-6 flex justify-center items-center gap-2 ${isMobile ? "" : "border-r-[1px] border-slate-300"} cursor-pointer`}>
              <i className="fa-solid fa-plus text-xl"></i>
              <p className="font-semibold">Add Todo</p>
            </div>
          }
          <div onClick={() => setShowMenu(prev => !prev)} className="hover:bg-slate-700 h-full py-4 px-6 relative z-20">
            <div className="flex flex-row justify-center items-center gap-3 cursor-pointer z-20">
              <div>
                <img data-tooltip-target="tooltip-default" src={user?.avatar} className="w-10 h-10 z-0 rounded-full border border-white" alt="User Avatar" />
              </div>
              <p className="text-lg font-semibold">{user.name}</p>
              <i className="fa-solid fa-chevron-down"></i>
            </div>
            {
              showMenu &&
              <div className="relative z-40">
                <div className="fixed bg-slate-600 bg-opacity-30 transition-opacity"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className={`absolute ${isMobile ? "top-36" : "top-16 right-10"} z-40  mb-2 w-72 shadow-lg bg-slate-50 hover:bg-slate-100  text-white text-sm rounded transition-opacity duration-300`}>
                      <div className="relative">
                        <div className="flex flex-col justify-center ">
                          <div className="w-full flex justify-center pt-4 pb-2">
                            <img className="w-20 h-20 rounded-full" src={user?.avatar} alt="User Avatar" />
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-black text-center px-2 rounded font-bold text-lg">{user?.name}</p>
                            <p className="text-black text-center px-2 rounded">{user?.email}</p>
                          </div>
                          <div className="hover:bg-slate-200 py-1 px-2 border-t-2 mt-2">
                            <button onClick={logout} className=" text-black text-lg font-bold py-1 px-2 rounded flex gap-2 items-center"><i className="fa-solid fa-arrow-right"></i> Logout</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            }
          </div>
        </div>
        <div className="md:hidden flex justify-center items-center px-4">
          <button onClick={() => setIsMobile(prev => !prev)} className="text-3xl">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
      {
        visible && <TodoDialog setVisible={setVisible} label={"Add New Todo"} type="add" />
      }
    </>
  )
}

export default Topbar

