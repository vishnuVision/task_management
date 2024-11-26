import PropTypes from "prop-types"
import { useEffect, useState } from "react"

function SubTaskCard({ subTask, handleDeleteSubTask, handleUpdateSubTask, isAdmin }) {
    const [isDrop, setIsDrop] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDrop(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [isDrop])

    return (
        <div>
            <div className="flex flex-wrap gap-2 items-center p-2 hover:bg-slate-100">
                <div className="flex flex-grow items-center justify-between">
                    <div className="flex -space-x-4 mt-2 items-center">
                        {
                            subTask?.owner && subTask?.owner.length > 0 && subTask?.owner.map(({ avatar }, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={avatar} className="w-10 h-10 rounded-full border-2 border-black" alt="User Avatar" />
                                </div>
                            ))
                        }
                    </div>
                    {
                        isAdmin &&
                        <div className="">
                            <div onClick={() => setIsDrop((prev) => !prev)} className="relative group">
                                <i className="fa-solid fa-chevron-down hover:bg-slate-200 p-2 rounded-full"></i>
                                <div className="absolute z-10 transform right-0 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                                    Show Options
                                </div>
                            </div>

                            {
                                isDrop &&
                                <div className="relative z-50">
                                    <div className="absolute z-40 w-40 bg-white transform right-0 top-0 mb-2 text-black text-sm rounded-md shadow-lg duration-300">
                                        <div className="z-20 flex flex-col justify-center">
                                            <div onClick={() => handleUpdateSubTask(subTask)} className="hover:bg-slate-100 px-3 py-2 cursor-pointer">
                                                Edit Subtask
                                            </div>
                                            <div onClick={() => handleDeleteSubTask(subTask?._id)} className="hover:bg-slate-100 z-40  px-3 py-2 cursor-pointer">
                                                Delete Subtask
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
                <p className="break-words w-full">{subTask?.title}</p>
            </div>
        </div>

    )
}

SubTaskCard.propTypes = {
    subTask: PropTypes.object,
    handleDeleteSubTask: PropTypes.func,
    handleUpdateSubTask: PropTypes.func,
    isAdmin: PropTypes.bool
}

export default SubTaskCard
