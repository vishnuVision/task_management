import axios from "axios";
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

function Commentcard({ comment, handleDelete, getComments, id }) {
    const [isDrop, setIsDrop] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [disable,setDisable] = useState(false);
    const [text, setText] = useState(comment?.text);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDrop(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [isDrop])

    const deleteImage = async (comment) => {
        let toastId = toast.loading("Deleting image...");
        if (comment) {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateComment/${comment?._id}`, {
                    withCredentials: true
                });
                const data = response?.data;
                if (data?.success) {
                    toast.success(data?.message, { id: toastId });
                    getComments(id);
                }
                else {
                    toast.error(data?.message, { id: toastId });
                }
            } catch (error) {
                if (!error?.response?.data?.success) {
                    toast.error(error.response.data.message, { id: toastId });
                }
            }

        }
    }

    const updateComment = async () => {
        setDisable(true);
        let toastId = toast.loading("Updating new todo...");
        if (comment) {
            if (!text) {
                toast.error("Please Provide valid credentails",{id:toastId});
            }
            else {
                try {
                    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateCommentText/${comment?._id}`, { text }, {
                        withCredentials: true
                    });
                    const data = response?.data;
                    if (data?.success) {
                        toast.success(data?.message, { id: toastId });
                        getComments(id);
                        setIsEdit(false);
                    }
                    else {
                        toast.error(data?.message, { id: toastId });
                    }
                } catch (error) {
                    if (!error?.response?.data?.success) {
                        toast.error(error.response.data.message, { id: toastId });
                    }
                }
            }
        }
        setDisable(false);
    }

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
                            <div className="absolute z-40 w-40 bg-white transform right-0 top-0 text-black text-sm rounded-md shadow-lg duration-300">
                                <div className="flex flex-col justify-center">
                                    <div onClick={() => setIsEdit(true)} className="hover:bg-slate-100 px-3 py-2 cursor-pointer">
                                        Edit Comment
                                    </div>
                                    <div onClick={() => handleDelete(comment)} className="hover:bg-slate-100 px-3 py-2 cursor-pointer">
                                        Delete Comment
                                    </div>
                                    {
                                        comment?.image &&
                                        <div className="hover:bg-slate-200 px-3 py-2 cursor-pointer">
                                            <div onClick={() => deleteImage(comment)} className="flex flex-row gap-5 items-center">
                                                <span>Delete Image</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="ms-11 pb-2">
                {
                    isEdit &&
                    <div className="flex flex-col flex-grow border border-black rounded-lg py-1 m-1">
                        <textarea value={text} onChange={(e) => setText(e.target.value)} className="m-1 flex-grow border-0 focus:ring-0 focus:border-0 focus:outline-none p-1" type="text" placeholder="Add Comment" />
                        <div className="flex flex-row-reverse gap-2 mx-1">
                            <button className="rounded-md bg-indigo-600 hover:bg-indigo-700 px-2 py-1 text-sm font-semibold text-white" onClick={updateComment}>Save changes</button>
                            <button className="border px-2 py-1 rounded-md hover:bg-slate-100 hover:border-slate-500" disabled={disable} onClick={()=>setIsEdit(false)}>Cancel</button>
                        </div>
                    </div>
                }
                {
                    !isEdit && <p className="break-words mb-2">{comment?.text}</p>
                }
                {
                    comment?.image &&
                    <div className="flex flex-row gap-5 items-center">
                        <img src={comment?.image} className={`w-24 h-24 hover:transition-all duration-150 hover:scale-110`} alt="User Avatar" />
                    </div>
                }
            </div>
        </div>
    )
}

Commentcard.propTypes = {
    comment: PropTypes.object,
    handleDelete: PropTypes.func,
    getComments: PropTypes.func,
    id: PropTypes.string
}

export default Commentcard
