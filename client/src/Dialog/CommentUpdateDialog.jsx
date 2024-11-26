import axios from "axios";
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import Input from "../components/Input";

function CommentUpdateDialog({ setVisible, label = "Add New Comment", comment = {}, id, refreshData }) {
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        if (comment) {
            setText(comment?.text);
        }
    }, [])

    const updateComment = async () => {
        setDisable(true);
        if (comment) {
            if (!text) {
                setError("Please fill all Credentials");
            }
            else {
                let toastId = toast.loading("Updating new todo...");
                try {
                    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateCommentText/${comment?._id}`, { text }, {
                        withCredentials: true
                    });
                    const data = response?.data;
                    if (data?.success) {
                        toast.success(data?.message, { id: toastId });
                        refreshData(id);
                        setVisible(false);
                        setText("");
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
        <>
            <div onClick={(e) => e.stopPropagation()} className="relative z-50 rounded-lg">
                <div className="fixed inset-0 bg-slate-500 bg-opacity-30 transition-opacity"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform pb-2 pt-2 overflow-hidden rounded-lg  bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="flex justify-end px-4 py-2">
                                <button onClick={() => setVisible(false)} className="text-2xl"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="bg-white pb-4 sm:px-6 sm:pb-4 rounded-lg">
                                <div className="rounded-lg">
                                    <div className="mt-3  sm:ml-4 sm:mt-0 sm:text-left rounded-lg">
                                        <div className="mt-2">
                                            <form className="">
                                                <h2 className="text-2xl font-bold text-center border py-2 rounded-t-lg">{label}</h2>
                                                <Input label="Title" type="text" name="title" placeholder="Enter Title" value={text} setValue={setText} />
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
        </>

    )
}

CommentUpdateDialog.propTypes = {
    setVisible: PropTypes.any,
    label: PropTypes.string,
    comment: PropTypes.any,
    refreshData: PropTypes.any,
    visible: PropTypes.bool,
    id: PropTypes.string
}

export default CommentUpdateDialog
