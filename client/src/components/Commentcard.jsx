import PropTypes from "prop-types"
import { useState } from "react"

function Commentcard({ comment, disable, handleDelete, handleUpdate, modifyImage, updateFileRef, setUpdateImage }) {
    const [isDrop, setIsDrop] = useState(false);
    return (
        <div className="p-2">
            <div className="flex flex-row items-center justify-between px-2">
                <div className="flex flex-row items-center gap-2">
                    <img src={comment?.owner?.avatar} className="w-8 h-8 rounded-full" alt="User Avatar" />
                    <p className="font-semibold">{comment?.owner?.name}</p>
                </div>
                <div className="">
                    <div onClick={() => setIsDrop((prev) => !prev)} className="relative group">
                        <i className="fa-solid fa-chevron-down hover:bg-slate-200 p-2 rounded-full"></i>
                        <div className="absolute transform right-0 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                            Show Options
                        </div>
                    </div>
                    {
                        isDrop &&
                        <div className="relative">
                            <div className="absolute z-10 w-40 bg-white transform right-0 top-1 mb-2 text-black text-sm rounded-md shadow-lg duration-300">
                                <div className="flex flex-col justify-center">
                                    <div onClick={() => handleUpdate(comment)} className="hover:bg-slate-200 px-3 py-2 cursor-pointer">
                                        Edit Comment
                                    </div>
                                    <div onClick={() => handleDelete(comment)} className="hover:bg-slate-200 px-3 py-2 cursor-pointer">
                                        Delete Comment
                                    </div>
                                    <div className="hover:bg-slate-200 px-3 py-2 cursor-pointer">
                                        {
                                            comment?.image &&
                                            <div onClick={() => modifyImage(comment)} className="flex flex-row gap-5 items-center">
                                                Edit Image
                                                <input onChange={(e) => setUpdateImage(e.target.files[0])} className="hidden" type="file" ref={updateFileRef} />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="ms-11 pb-2">
                <p className="break-words mb-2">{comment?.text}</p>
                {
                    comment?.image &&
                    <div className="flex flex-row gap-5 items-center">
                        <img src={comment?.image} className={`w-24 h-24 ${disable ? "opacity-30" : ""} hover:transition-all duration-150 hover:scale-110`} alt="User Avatar" />
                    </div>
                }
            </div>
        </div>
    )
}

Commentcard.propTypes = {
    comment: PropTypes.object,
    disable: PropTypes.bool,
    handleDelete: PropTypes.func,
    handleUpdate: PropTypes.func,
    modifyImage: PropTypes.func,
    updateFileRef: PropTypes.object,
    setUpdateImage: PropTypes.func
}

export default Commentcard
