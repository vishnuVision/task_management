import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import CommentDeleteDialog from "../Dialog/commentDeleteDialog";
import CommentUpdateDialog from "../Dialog/commentUpdateDialog";
import TodoDialog from "../Dialog/TodoDialog";
import TodoDeleteDialog from "../Dialog/TodoDeleteDialog";
import { deassignComments } from "../redux/slices/notificationReducer";
import SubTaskCard from "./SubTaskCard";
import Commentcard from "./Commentcard";

function TodoDetails({ todoData = {}, setIsSideBar, subTask,comments ,refreshsubTask,getComments }) {

    const {admin:isAdmin} = useSelector(state=>state?.authReducer?.user);
    const { avatar } = useSelector(state => state.authReducer.user);

    const [isSubTaskDropDown, setIsSubTaskDropDown] = useState(false);
    const [isCommentTaskDropDown, setIsCommentTaskDropDown] = useState(false);
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [updateImage,setUpdateImage] = useState("");
    const [effectedComment, setEffectedComment] = useState({});
    const [effectedSubTask, setEffectedSubTask] = useState({});
    const [lastModifiedComment, setLastModifiedComment] = useState({});
    const [disable,setDisable] = useState(false);

    // dialogs state
    const [isVisibleDelete, setIsVisibleDelete] = useState(false);
    const [isVisibleUpdate, setIsVisibleUpdate] = useState(false);
    const [isVisibleSubTaskDelete, setIsVisibleSubTaskDelete] = useState(false);
    const [isVisibleSubTaskUpdate, setIsVisibleSubTaskUpdate] = useState(false);

    const fileRef = useRef();
    const updateFileRef = useRef();
    const dispatch = useDispatch();

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
        if((!text && !image) || !todoData?.id)
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

    useEffect(()=>{
        if(isCommentTaskDropDown)
        {
            dispatch(deassignComments(todoData?.id))
            // if()
            console.log(todoData?.id)
            // console.log("update comments")
        }
    },[isCommentTaskDropDown])

    return (
        <>
            <div className={`z-30 flex fixed flex-col justify-between right-0 top-0 h-full w-84 sm:w-96 lg:w-1/3 bg-slate-50`}>
                <div className="flex flex-col overflow-y-scroll">
                    <div className="border-b-[1px] border-black p-4 flex justify-between items-center">
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
                                            <SubTaskCard key={idx} subTask={subTask} handleDeleteSubTask={handleDeleteSubTask} handleUpdateSubTask={handleUpdateSubTask} isAdmin={isAdmin}/>
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
                                            <Commentcard key={idx} comment={comment} disable={disable} handleDelete={handleDelete} handleUpdate={handleUpdate} modifyImage={modifyImage} updateFileRef={updateFileRef} setUpdateImage={setUpdateImage}/>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="border-t-[1px]  border-slate-200 p-4 flex flex-col justify-start gap-2">
                    <div className="flex gap-2 pt-4">
                        <div className="flex flex-col gap-2 justify-start">
                            <img src={avatar} className="w-8 h-8 rounded-full border border-white" alt="User Avatar" />
                            <button onClick={() => fileRef.current.click()} className="bg-slate-400 py-1 px-2 rounded-full">
                                {
                                    image && <i className="fa-solid fa-file"></i>
                                }
                                {
                                    !image && <i className="fa-solid fa-plus"></i>
                                }
                            </button>
                        </div>
                        <textarea value={text} onChange={(e) => setText(e.target.value)} className="border border-slate-600 h-24 px-2 rounded-md flex-grow" type="text" placeholder="Add Comment" />
                        <input onChange={(e) => setImage(e.target.files[0])} className="hidden" type="file" ref={fileRef} />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={createComment} className="bg-green-400 py-1 px-2 rounded-xl mt-1">comment</button>
                    </div>
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
    comments: PropTypes.array,
    refreshsubTask: PropTypes.func,
    getComments: PropTypes.func
};

export default TodoDetails
