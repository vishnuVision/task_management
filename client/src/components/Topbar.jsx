import { useState } from "react"
import TodoDialog from "../Dialog/TodoDialog";
import { useSelector } from "react-redux";

function Topbar() {
  const [visible,setVisible] = useState(false);

  const {admin:isAdmin} = useSelector(state=>state?.authReducer?.user);

  return (
    <>
      <div className="h-14 bg-slate-100 flex z-20 items-center px-2 md:px-4 fixed top-0 w-full">
        {
          isAdmin && <button className="bg-blue-600 px-1 py-1 md:px-2 md:py-2 text-white rounded-lg text-sm" onClick={()=>setVisible(prev=>!prev)}><span><i className="fa-solid fa-plus"></i></span> Add Todo</button>
        }
      <div className="flex-grow flex justify-center items-center sm:text-lg text-md font-extrabold lg:text-md ">
        Task manager
      </div>
    </div>
    {
      visible && <TodoDialog setVisible={setVisible} label={"Add New Todo"} type="add"/>
    }
    </>
    
  )
}

export default Topbar
