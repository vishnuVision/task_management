import axios from "axios";
import PropTypes from "prop-types"
import { useContext, useState } from "react";
import getDetails from "../context/useContext";
import toast from "react-hot-toast";

function TodoDeleteDialog({ visible = false, setVisible, id, refreshData:refreshSubTask, mode="todo",label }) {
    const [disable, setDisable] = useState(false);
    const { refreshData } = useContext(getDetails);

    const handleSubmit = async () => {
        setDisable(true);
        let toastId = toast.loading("Todo Deleting...");
        if(id)
        {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/deleteTodo/${id}`,{withCredentials:true});
                const data = response?.data;
                if(data?.success)
                {
                    toast.success("Todo Deleted Successfully!",{id:toastId});
                    refreshData(null,true,false,data?.data?._id);
                    setVisible(false);
                }
                else
                {
                    toast.success("Something Wrong",{id:toastId});
                }
            } catch (error) {
                if(!error?.response?.data?.success)
                {
                    toast.error(error.response.data.message,{id:toastId});
                }
            }
        }
        setDisable(false);
    }

    const deleteSubTask = async () => {
        setDisable(true);
        let toastId = toast.loading("SubTodo Deleting...");
        if(id)
        {
            try {
                const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/deleteSubtodo/${id}`,{withCredentials:true});
                const data = response?.data;
                if(data?.success)
                {
                    toast.success("SubTodo Deleted Successfully!",{id:toastId});
                    refreshSubTask();
                    setVisible(false);
                }
                else
                {
                    toast.success("Something Wrong",{id:toastId});
                }
            } catch (error) {
                if(!error?.response?.data?.success)
                {
                    toast.error(error.response.data.message,{id:toastId});
                }
            }
        }
        setDisable(false);
    }

    if (visible)
        return (
            <>
                <div className="relative z-40">
                    <div className="fixed inset-0 bg-slate-600 bg-opacity-30 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                            <svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold text-gray-900" id="modal-title">{label}</h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">Are you sure you want to delete Todo?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button onClick={mode==="todo"?handleSubmit:deleteSubTask} disabled={disable} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset hover:bg-blue-500 sm:mt-0 sm:w-auto">Delete</button>
                                    <button onClick={() => setVisible(false)} type="button" className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 sm:ml-3 sm:w-auto me-2">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
}

TodoDeleteDialog.propTypes = {
    visible: PropTypes.bool,
    setVisible: PropTypes.any,
    id: PropTypes.any,
    refreshData:PropTypes.func,
    mode:PropTypes.string,
    label:PropTypes.string
}

export default TodoDeleteDialog
