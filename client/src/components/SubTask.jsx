import PropTypes from "prop-types"
import { useSelector } from "react-redux";

function SubTask({subTask=[],setVisible}) {

    const {admin:isAdmin} = useSelector(state=>state?.authReducer?.user);

  return (
    <div className="border-black border-t-2 mt-4">
        {
            subTask.length <= 0 && 
            <div className="flex mt-2 justify-center items-center">No SubTask Found</div>
        }
        {
            subTask && subTask.length > 0 && subTask.map(({title,owner},idx)=>(
                <div key={idx} className="flex flex-row gap-2 items-center border-slate-300 border-b-2 pb-2">
                    <div className="flex -space-x-4 mt-2 items-center">
                        {
                            owner && owner.length > 0 && owner.map(({avatar},idx)=>(
                                <div key={idx} className="relative group">
                                    <img src={avatar} className="w-10 h-10 rounded-full border-2 border-black" alt="User Avatar" />
                                </div>
                            ))
                        }
                    </div>
                    <p className="flex-grow break-words">{title}</p>
                </div>
            ))
        }
        {
            isAdmin &&
            <div className="flex justify-end mt-3">
                <button onClick={()=>setVisible(true)} className="bg-blue-400 text-white py-2 px-2 rounded-2xl">
                    <i className="fa-solid fa-plus"></i> Add subtask
                </button>
            </div>
        }
        
    </div>
  )
}

SubTask.propTypes = {
    subTask:PropTypes.array,
    visible:PropTypes.bool,
    setVisible:PropTypes.any
}

export default SubTask
