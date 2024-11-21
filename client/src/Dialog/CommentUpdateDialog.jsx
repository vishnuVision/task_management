import axios from "axios";
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";

function CommentUpdateDialog({ setVisible, label = "Add New Comment", comment = {}, refreshData}) {
    const [disable,setDisable] = useState(false);
    const [error,setError] = useState("");
    const [text,setText] = useState("");

    useEffect(() => {
        if(comment)
        {
            setText(comment?.text);
        }
    }, [])

    const updateComment = async () => {
        setDisable(true);
        if (comment) {
            if(!text )
            {
                setError("Please fill all Credentials");
            }
            else
            {
                let toastId = toast.loading("Updating new todo...");
                try {
                    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateCommentText/${comment?._id}`, {text} ,{
                        withCredentials:true
                    });
                    const data = response?.data;
                    if (data?.success) {
                        toast.success(data?.message, { id: toastId });
                        refreshData();
                        setVisible(false);
                        setText("");
                    }
                else {
                    toast.error(data?.message, { id: toastId });
                }
                } catch (error) {
                    if(!error?.response?.data?.success)
                    {
                        toast.error(error.response.data.message,{id:toastId});
                    }
                }
            }
        }
        setDisable(false);
    }

  return (
    <div className="relative z-10">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform pb-2 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="">
                            <div className="mt-3  sm:ml-4 sm:mt-0 sm:text-left">
                                <div className="mt-2">
                                    <form className="">
                                        <h2 className="text-2xl font-bold text-center">{label}</h2>
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={text}
                                                onChange={(e)=>setText(e.target.value)}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </form>
                                    {
                                        error &&
                                        <div className="text-red-500 mt-2">
                                            <p>{error}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" disabled={disable} onClick={updateComment} className="mt-3 inline-flex w-full justify-center bg-blue-600 hover:bg-blue-500 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset text-white sm:mt-0 sm:w-auto">Submit</button>
                        <button type="button" onClick={() => setVisible(false)} className="w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-black shadow-sm sm:ml-3 hover:bg-gray-5-100 sm:w-auto me-2">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

CommentUpdateDialog.propTypes = {
    setVisible: PropTypes.any,
    label: PropTypes.string,
    comment: PropTypes.any,
    refreshData:PropTypes.any,
    visible: PropTypes.bool
}

export default CommentUpdateDialog
