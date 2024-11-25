import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Sidebar() {
  const { user } = useSelector(state => state.authReducer);
  const path = window.location.pathname;

  return (
    <div className="bg-slate-900 text-white flex fixed h-screen">
      <div className="w-12 md:w-16 pt-2 text-center 2xl:w-20 2xl:pt-4 flex flex-col flex-grow justify-between">
        <div className="flex flex-col gap-2">
          <p className="mb-4 mt-[6px] lg:mt-3 sm:mt-4 2xl:text-lg 2xl:font-semibold">Tools</p>
          <div className={`relative group py-2 ${path === "/" ? "bg-slate-400" : ""}`}>
            <Link className="text-2xl 2xl:text-2xl" to="/"><i className="fa-regular fa-square-check"></i></Link>
            <div className="absolute z-10 left-3/4 transform -translate-x-1 -bottom-1 mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Home
            </div>
          </div>
          {
            user?.admin &&
            <div className="relative group">
              <Link className="text-2xl 2xl:text-2xl" to="/userTodo"><i className="fa-regular fa-user"></i></Link>
              <div className="absolute z-10 left-3/4 transform -translate-x-1 top-10 mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Get User Todos
              </div>
            </div>
          }
        </div>
        <div className="flex flex-col gap-4 my-2">
          <div className="relative group">
            <div className="flex justify-center items-center mb-2">
              <img data-tooltip-target="tooltip-default" src={user?.avatar} className="w-10 h-10 rounded-full border border-white" alt="User Avatar" />
            </div>
            <div className="absolute z-40 left-3/4 ms-2 transform -translate-x-1 -bottom-1 mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {user?.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
