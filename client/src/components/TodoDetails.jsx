import PropTypes from "prop-types"
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import CommentDeleteDialog from "../Dialog/commentDeleteDialog";
import CommentUpdateDialog from "../Dialog/commentUpdateDialog";
import TodoDialog from "../Dialog/TodoDialog";
import TodoDeleteDialog from "../Dialog/TodoDeleteDialog";

function TodoDetails({ todoData = {}, setIsSideBar, subTask, refreshsubTask }) {

    const {admin:isAdmin} = useSelector(state=>state?.authReducer?.user);
    const [isSubTaskDropDown, setIsSubTaskDropDown] = useState(false);
    const [isCommentTaskDropDown, setIsCommentTaskDropDown] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [updateImage,setUpdateImage] = useState("");
    const [comments, setComments] = useState([]);
    const [effectedComment, setEffectedComment] = useState({});
    const [effectedSubTask, setEffectedSubTask] = useState({});

    const [isVisibleDelete, setIsVisibleDelete] = useState(false);
    const [isVisibleUpdate, setIsVisibleUpdate] = useState(false);

    const [isVisibleSubTaskDelete, setIsVisibleSubTaskDelete] = useState(false);
    const [isVisibleSubTaskUpdate, setIsVisibleSubTaskUpdate] = useState(false);

    const [lastModifiedComment, setLastModifiedComment] = useState({});

    const [disable,setDisable] = useState(false);

    const path = window.location.pathname;

    const fileRef = useRef();
    const updateFileRef = useRef();
    const { avatar } = useSelector(state => state.authReducer.user);

    const getComments = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/comments/${todoData?.id}`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.data) {
                const { success, message, data } = response.data;

                if (success) {
                    setComments(data);
                }
                else {
                    toast.error(message);
                }
            }
        } catch (error) {
            if (!error?.response?.data?.success) {
                toast.error(error.response.data.message);
            }
        }
    }

    const resetData = () => {
        setText("");
        setImage("");
    }

    useEffect(() => {
        if (todoData) {
            getComments();
        }
    }, [])

    const createComment = async () => {
        let toastId = toast.loading("Comment Creating...");
        if(!text || !image || !todoData?.id)
        {
            toast.error("All fields are required",{id:toastId});
        }
        else
        { 
            try {
                const formdata = new FormData();
                formdata.append("text", text);
                formdata.append("image", image);
                formdata.append("todo", todoData?.id);
    
                const response = await axios.post(`http://localhost:9000/api/v1/createComment`, formdata, {
                    withCredentials: true,
                });
    
                if (response.data) {
                    const { success, message } = response.data;
    
                    if (success) {
                        toast.success(message, { id: toastId });
                        resetData();
                        getComments();
                    }
                    else {
                        toast.error(message);
                    }
                }
                resetData();
            } catch (error) {
                if (!error?.response?.data?.success) {
                    toast.error(error.response.data.message, { id: toastId });
                }
            }
        }
    }

    const handleDelete = async (commentData) => {
        setIsVisibleDelete(true);
        setEffectedComment(commentData);
    }

    const handleUpdate = async (commentData) => {
        setIsVisibleUpdate(true);
        setEffectedComment(commentData);
    }

    const handleDeleteSubTask = async (id) => {
        setEffectedSubTask(id);
        setIsVisibleSubTaskDelete(true);
    }

    const handleUpdateSubTask = async (data) => {
        setEffectedSubTask(data);
        setIsVisibleSubTaskUpdate(true);
    }

    const modifyImage = async (comment) => {
        updateFileRef.current.click();
        setLastModifiedComment(comment);
    }

    const handleUpdateImage = async () => {
        setDisable(true);
        let toastId = toast.loading("Updating new todo...");
        if (lastModifiedComment) {
            if(!updateImage )
            {
                toast.error("Image isn't Selected Properly",{id:toastId})
            }
            else
            {
                toast.loading("Updating new todo...",{id:toastId});
                try {
                    const formdata = new FormData();
                    formdata.append("image",updateImage);

                    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateComment/${lastModifiedComment?._id}`, formdata ,{
                        withCredentials:true
                    });
                    const data = response?.data;
                    if (data?.success) {
                        toast.success(data?.message, { id: toastId });
                        getComments();
                        setLastModifiedComment({});
                        setUpdateImage("");
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

    useEffect(() => {
        if(Object.keys(lastModifiedComment).length > 0)
        {
            handleUpdateImage();
        }
    }, [updateImage])

    return (
        <>
            <div style={{ height: path === "/" ? "calc(100vh - 3.5rem)" : "100vh" }} className={`z-40 flex fixed flex-col justify-between right-0 w-72 sm:w-84 lg:w-1/3 bg-slate-100 ${path === "/" ? "top-14" : "top-0"}`}>
                <div className="flex flex-col overflow-y-scroll">
                    <div className="bg-slate-200 p-4 flex justify-between items-center">
                        <p className={`${todoData?.status === "COMPLETED" ? "bg-green-100 border border-green-300" : ""} ${todoData?.status === "INCOMPLETED" ? "bg-red-100 border border-red-300 " : ""} ${todoData?.status === "INPROGRESS" ? "bg-blue-100 border border-blue-400" : ""} px-2 py-1 rounded-lg`}>{todoData?.status.toLowerCase()}</p>
                        <button onClick={() => { resetData(); setIsSideBar(false); }} className="text-2xl"><i className="fa-solid fa-arrow-right-to-bracket"></i></button>
                    </div>
                    <div className="flex flex-col p-2 px-4">
                        <p className="text-lg font-bold">{todoData?.title}</p>
                        <div className="flex flex-col mt-8 gap-4">
                            <div className="flex gap-4 flex-row justify-between">
                                <div className="font-semibold flex items-center">
                                    Assignee:
                                </div>
                                <div className="flex flex-wrap gap-2 flex-grow ms-2">
                                    {
                                        todoData?.avatar && todoData?.avatar.length > 0 && todoData.avatar.map(({ avatar, username }, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <img src={avatar} className="w-10 h-10 rounded-full" alt="User Avatar" />
                                                <div className="flex flex-col ml-2">
                                                    <p className="font-bold">{username}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex gap-4 flex-row justify-between">
                                <div className="font-semibold flex items-center">
                                    Priority:
                                </div>
                                <div className="flex-grow justify-center items-center ms-4">
                                    <span className={`${todoData?.priority === "HIGH" ? "bg-green-100 border border-green-300" : ""} ${todoData?.priority === "LOW" ? "bg-red-100 border border-red-300 " : ""} ${todoData?.priority === "MEDIUM" ? "bg-blue-100 border border-blue-400" : ""} py-1 px-2 rounded-lg text-center`}>
                                        {todoData?.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="font-semibold">
                                Description:
                            </div>
                            <div className="mx-2">
                                {todoData?.description}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <div onClick={() => setIsSubTaskDropDown(prev => !prev)} className="flex gap-2 font-semibold align-middle cursor-pointer">
                                <div className="align-middle">
                                    {
                                        isSubTaskDropDown &&
                                        <i className="fa-solid fa-chevron-down"></i>
                                    }
                                    {
                                        !isSubTaskDropDown &&
                                        <i className="fa-solid fa-chevron-right"></i>
                                    }
                                </div>
                                <p>SubTask</p>
                                <p className="bg-slate-200 rounded-full px-2">{subTask.length}</p>
                            </div>
                            {
                                isSubTaskDropDown &&
                                <div className="flex flex-col gap-2 overflow-x-hidden">
                                    {
                                        subTask && subTask.length > 0 && subTask.map((subTask, idx) => (
                                            <div key={idx} className="flex flex-wrap gap-2 items-center hover:bg-slate-200 p-2">
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
                                        ))
                                    }
                                </div>
                            }

                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <div onClick={() => setIsCommentTaskDropDown(prev => !prev)} className="flex gap-2 font-semibold align-middle cursor-pointer">
                                <div className="align-middle">
                                    {
                                        isCommentTaskDropDown &&
                                        <i className="fa-solid fa-chevron-down"></i>
                                    }
                                    {
                                        !isCommentTaskDropDown &&
                                        <i className="fa-solid fa-chevron-right"></i>
                                    }
                                </div>
                                <p className="align-middle">Comments</p>
                                <p className="bg-slate-200 rounded-full px-2">{comments.length}</p>
                            </div>
                            {
                                isCommentTaskDropDown &&
                                <div className="flex flex-col gap-2">
                                    {
                                        comments.length <= 0 &&
                                        <div className="flex justify-center items-center">No comments Found</div>
                                    }
                                    {
                                        comments && comments.length > 0 && comments.map((comment, idx) => (
                                            <div key={idx} className="hover:bg-slate-200 p-2">
                                                <div className="flex flex-row gap-2 items-center">
                                                    <img src={comment?.owner?.avatar} className="w-8 h-8 rounded-full" alt="User Avatar"/>
                                                    <p className="font-semibold">{comment?.owner?.name}</p>
                                                </div>
                                                <div className="ms-11">
                                                    {
                                                        comment?.image &&
                                                        <div className="flex flex-row gap-5 items-center">
                                                            <img src={comment?.image} className={`w-20 h-20 ${disable ? "opacity-30" : ""}`} alt="User Avatar" />
                                                            <div className="relative group">
                                                                <button disabled={disable} onClick={()=>modifyImage(comment)} className="hover:bg-slate-300 px-2 py-1 rounded-full"><i className="fa-solid fa-camera"></i></button>
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

                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="bg-slate-200 p-4 flex flex-wrap justify-start gap-2">
                    <div className="flex gap-2 justify-start">
                        <img src={avatar} className="w-8 h-8 rounded-full" alt="User Avatar" />
                        <button onClick={() => fileRef.current.click()} className="bg-slate-400 py-1 px-2 rounded-full">
                            {
                                image && <i className="fa-solid fa-file"></i>
                            }
                            {
                                !image && <i className="fa-solid fa-plus"></i>
                            }
                        </button>
                    </div>
                    <input value={text} onChange={(e) => setText(e.target.value)} className="p-1 rounded-md flex-grow" type="text" placeholder="Add Comment" />
                    <button onClick={createComment} className="bg-slate-400 py-1 px-2 rounded-full"><i className="fa-regular fa-paper-plane"></i></button>
                    <input onChange={(e) => setImage(e.target.files[0])} className="hidden" type="file" ref={fileRef} />
                </div>
            </div>
            {
                isVisibleDelete && <CommentDeleteDialog visible={isVisibleDelete} setVisible={setIsVisibleDelete} comment={effectedComment} refreshData={getComments} />
            }
            {
                isVisibleUpdate && <CommentUpdateDialog visible={isVisibleUpdate} label="update comment" setVisible={setIsVisibleUpdate} type={"update"} comment={effectedComment} refreshData={getComments} />
            }
            {
                isVisibleSubTaskDelete && <TodoDeleteDialog visible={isVisibleSubTaskDelete} label="Delete Subtask" setVisible={setIsVisibleSubTaskDelete} refreshData={refreshsubTask} mode="subTask"  id={effectedSubTask}/>
            }
            {
                isVisibleSubTaskUpdate && <TodoDialog visible={isVisibleDelete} id={todoData.id} setVisible={setIsVisibleSubTaskUpdate} label={"Update New Subtask"} mode="subTask" todo={effectedSubTask} type="update" refreshSubTodoData={refreshsubTask} />
            }
        </>

    )
}

TodoDetails.propTypes = {
    todoData: PropTypes.object,
    isSideBar: PropTypes.bool,
    setIsSideBar: PropTypes.any,
    subTask: PropTypes.array,
    refreshsubTask: PropTypes.func,
};

export default TodoDetails
