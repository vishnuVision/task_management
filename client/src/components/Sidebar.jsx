import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { assignIsMobile } from "../redux/slices/authReducer";
import { useState } from "react";
import ProfileUpdate from "../Dialog/ProfileUpdate";

function Sidebar() {
  const { user, isMobile, users } = useSelector(state => state.authReducer);
  const path = window.location.pathname;
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <div className={`bg-[#2e2e30] text-white z-30 flex fixed h-screen ${isMobile ? "flex animate-slideInLeft duration-50" : "hidden"}`}>
        <div className="w-64 pt-2 text-center 2xl:pt-4 flex flex-col justify-start items-start">
          <div className="flex flex-col w-full items-start py-2">
            <div className="text-2xl flex justify-center items-center cursor-pointer px-4 z-50">
              <button onClick={() => dispatch(assignIsMobile())}><i className="fa-solid fa-bars"></i></button>
            </div>
            <div className={`relative w-full flex justify-start mt-4 px-4 group py-4 ${path === "/" ? "bg-[#ffffff1c]" : ""}`}>
              <Link className="text-2xl 2xl:text-2xl gap-2 flex items-center" to="/"><i className="fa-regular fa-square-check"></i><span className="text-sm">My tasks</span></Link>
            </div>
            {
              user?.admin &&
              <div className={`relative w-full flex justify-start px-4 group py-4 ${path === "/userTodo" ? "bg-[#ffffff1c]" : ""}`}>
                <Link className="text-2xl 2xl:text-2xl gap-2 flex items-center" to={`/userTodo/${(users.filter(({ admin }) => admin === false))[0]?._id}`}><i className="fa-regular fa-user"></i><span className="text-sm">Users tasks</span></Link>
              </div>
            }
            <div onClick={() => setVisible(prev => !prev)} className="flex w-full justify-start px-3 py-2 gap-2 items-center mb-2 hover:bg-[#ffffff1c] cursor-pointer">
              <img data-tooltip-target="tooltip-default" src={user?.avatar} className="w-8 h-8 rounded-full border border-white" alt="User Avatar" />
              <span>{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
      {
        visible && <ProfileUpdate setVisible={setVisible} user={user}/>
      }
    </>
  )
}

export default Sidebar
