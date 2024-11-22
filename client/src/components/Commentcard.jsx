import PropTypes from "prop-types"

function Commentcard({comment,disable,handleDelete,handleUpdate,modifyImage,updateFileRef,setUpdateImage}) {
    return (
        <div className="hover:bg-slate-200 p-2">
            <div className="flex flex-row gap-2 items-center">
                <img src={comment?.owner?.avatar} className="w-8 h-8 rounded-full" alt="User Avatar" />
                <p className="font-semibold">{comment?.owner?.name}</p>
            </div>
            <div className="ms-11">
                {
                    comment?.image &&
                    <div className="flex flex-row gap-5 items-center">
                        <img src={comment?.image} className={`w-20 h-20 ${disable ? "opacity-30" : ""}`} alt="User Avatar" />
                        <div className="relative group">
                            <button disabled={disable} onClick={() => modifyImage(comment)} className="hover:bg-slate-300 px-2 py-1 rounded-full"><i className="fa-solid fa-camera"></i></button>
                            <div className="absolute z-10  transform -translate-x-6 bottom-full mb-2 w-max bg-gray-800 text-white text-sm py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Edit Image
                            </div>
                        </div>
                        <input onChange={(e) => setUpdateImage(e.target.files[0])} className="hidden" type="file" ref={updateFileRef} />
                    </div>
                }
                <p className="break-words">{comment?.text}</p>
            </div>
            <div className="flex flex-row-reverse me-2 gap-4">
                <div className="relative group">
                    <button onClick={() => handleDelete(comment)} className="text-lg"><i className="fa-solid fa-trash"></i></button>
                    <div className="absolute z-10  transform -translate-x-6 bottom-full mb-2 w-max bg-gray-800 text-white text-sm py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Delete
                    </div>
                </div>
                <div className="relative group">
                    <button onClick={() => handleUpdate(comment)} className="text-lg"><i className="fa-solid fa-pen-to-square"></i></button>
                    <div className="absolute z-10  transform -translate-x-6 bottom-full mb-2 w-max bg-gray-800 text-white text-sm py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Update
                    </div>
                </div>
            </div>
        </div>
    )
}

Commentcard.propTypes = {
    comment:PropTypes.object,
    disable:PropTypes.bool,
    handleDelete:PropTypes.func,
    handleUpdate:PropTypes.func,
    modifyImage:PropTypes.func,
    updateFileRef:PropTypes.object,
    setUpdateImage:PropTypes.func
}

export default Commentcard
