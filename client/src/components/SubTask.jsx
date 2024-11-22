import PropTypes from "prop-types"
import { useSelector } from "react-redux";

function SubTask({subTask=[],setVisible,color}) {
    console.log(color);
    const {admin:isAdmin} = useSelector(state=>state?.authReducer?.user);

  return (
    <div className="mt-4">
        {
            subTask.length <= 0 && 
            <div className="flex mt-2 justify-center items-center">No SubTask Found</div>
        }
        {
            subTask && subTask.length > 0 && subTask.map(({title,owner},idx)=>(
                <div key={idx} className={`flex flex-row gap-2 items-center border-slate-300 border-b-[1px] py-1 hover:bg-${color}-200`}>
                    <div className="flex -space-x-4 mx-2 py-2 items-center">
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
            <div className={`flex mt-3 hover:bg-${color}-200`}>
                <button onClick={()=>setVisible(true)} className={`py-2 px-2 flex flex-grow items-center gap-2 justify-start`}>
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
    setVisible:PropTypes.any,
    color:PropTypes.string
}

export default SubTask
