import PropTypes from "prop-types"

function SubTaskCard({ subTask, handleDeleteSubTask, handleUpdateSubTask, isAdmin }) {
    return (
        <div>
            <div className="flex flex-wrap gap-2 items-center hover:bg-slate-200 p-2">
                <div className="flex -space-x-4 mt-2 items-center">
                    {
                        subTask?.owner && subTask?.owner.length > 0 && subTask?.owner.map(({ avatar }, idx) => (
                            <div key={idx} className="relative group">
                                <img src={avatar} className="w-10 h-10 rounded-full border-2 border-black" alt="User Avatar" />
                            </div>
                        ))
                    }
                </div>
                <p className="break-words w-full">{subTask?.title}</p>
                {
                    isAdmin &&
                    <div className="flex w-full flex-row-reverse gap-4">
                        <div className="relative group">
                            <button onClick={() => handleDeleteSubTask(subTask?._id)} className="text-lg"><i className="fa-solid fa-trash"></i></button>
                            <div className="absolute z-10  transform -translate-x-6 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Delete
                            </div>
                        </div>
                        <div className="relative group">
                            <button onClick={() => handleUpdateSubTask(subTask)} className="text-lg"><i className="fa-solid fa-pen-to-square"></i></button>
                            <div className="absolute z-10  transform -translate-x-6 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Update
                            </div>
                        </div>
                    </div>
                }
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
