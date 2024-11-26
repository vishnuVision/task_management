import axios from "axios";
import PropTypes from "prop-types"
import { useContext, useEffect, useState } from "react"
import getDetails from "../context/useContext";
import toast from "react-hot-toast";
import MultiSelect from "../components/MultiSelect";
import Input from "../components/Input";

function TodoDialog({ setVisible, label = "Add New Todo", type="add", todo = {}, mode="todo",id, refreshSubTodoData,setIsSideBar,refreshTodoData}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [disable, setDisable] = useState(false);
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [error, setError] = useState("");
    const [options,setOptions] = useState([]);
    const {refreshData} = useContext(getDetails);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        getAllUser();
        if (todo && type==="update") {
            setTitle(todo?.title);
            setDescription(todo?.description);
            setStatus(todo?.status);
            setPriority(todo?.priority);
            if(mode === "subTask")
            {
                setSelectedOptions(todo?.owner.map(({_id})=>{return _id}));
                setOptions(todo?.owner);
            }
            if(mode === "todo")
            {
                setSelectedOptions(todo?.owner);
            }
        }
    }, [])

    const resetData = () => {
        setTitle("");
        setDescription("");
        setStatus("");
        setPriority("");
    }

    const getAllUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/getallusers`,{
                withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                }
            });
            const data = response?.data;
            if (data?.success) {
                setOptions(data?.data);
                if(todo?.owner?.length > 0)
                {
                    if(mode==="todo")
                    {
                        setSelectedUsers(data?.data?.filter(({ _id }) => todo?.owner?.includes(_id))?.map(({ username }) => username));
                    }
                    else
                    {
                        setSelectedUsers(todo.owner.map(({username})=>{return username}));
                    }
                    
                }
            }
        } catch (error) {
            if(!error?.response?.data?.success)
            {
                toast.error(error.response.data.message);
            }
        }
    }

    const addTodo = async () => {
        setDisable(true);
        if(!title || !description || !priority || !status)
        {
            setError("Please fill all Credentials");
        }
        else
        {
            let toastId = toast.loading("Creating new todo...");
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/createTodo`, { title, description, status, priority,assignee:selectedOptions },{
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json"
                    }
                });
                const data = response?.data;
                if (data?.success) {
                    toast.success(data?.message, { id: toastId });
                    refreshData();
                    setVisible(false);
                    resetData();
                }
                else {
                    toast.danger(data?.message, { id: toastId });
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

    const updateTodo = async () => {
        setDisable(true);
        if (todo) {
            if(!title || !description || !priority || !status)
            {
                setError("Please fill all Credentials");
            }
            else
            {
                let toastId = toast.loading("Updating new todo...");
                try {
                    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateTodo/${todo?._id}`, { title, description, status, priority,assignee:selectedOptions },{
                        withCredentials:true,
                        headers:{
                            "Content-Type":"application/json"
                        }
                    });
                    const data = response?.data;
                    console.log(data);
                    if (data?.success) {
                        
                        toast.success(data?.message, { id: toastId });
                        setVisible(false);
                        refreshData(null,true,false,data?.data?._id);
                        if(setIsSideBar)
                        {
                            setIsSideBar(false);
                        }
                        if(refreshTodoData)
                        {
                            refreshTodoData();
                        }
                        resetData();
                    }
                else {
                    toast.danger(data?.message, { id: toastId });
                }
                } catch (error) {
                    console.log(error);
                    if(!error?.response?.data?.success)
                    {
                        toast.error(error.response.data.message,{id:toastId});
                    }
                }
            }
        }
        setDisable(false);
    }

    const addSubTodo = async () => {
        setDisable(true);
        if(!title || !description || !status  || !id)
        {
            setError("Please fill all Credentials");
        }
        else
        {
            let toastId = toast.loading("Creating new Subtodo...");
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/createSubtodo`, { title, description, status, assignee:selectedOptions, todo:id },{
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json"
                    }
                });
                const data = response?.data;
                if (data?.success) {
                    toast.success(data?.message, { id: toastId });
                    refreshSubTodoData();
                    setVisible(false);
                    resetData();
                }
                else {
                    toast.danger(data?.message, { id: toastId });
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

    const updateSubTodo = async () => {
        if(!title || !description || !status  || !id || !todo?._id)
        {
            setError("Please fill all Credentials");
        }
        else
        {
            let toastId = toast.loading("Updating new Subtodo...");
            try {
                const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateSubtodo/${todo?._id}`, { title, description, status, assignee:selectedOptions, todo:id },{
                    withCredentials:true,
                    headers:{
                        "Content-Type":"application/json"
                    }
                });
                const data = response?.data;
                if (data?.success) {
                    toast.success(data?.message, { id: toastId });
                    refreshSubTodoData(id);
                    setVisible(false);
                    resetData();
                }
                else {
                    toast.danger(data?.message, { id: toastId });
                }
            } catch (error) {
                if(!error?.response?.data?.success)
                {
                    toast.error(error.response.data.message,{id:toastId});
                }
            }
        }
    }

    return (
        <>
            <div onClick={(e)=>e.stopPropagation()} className="relative z-50">
                <div className="fixed inset-0 bg-slate-500 bg-opacity-30 transition-opacity"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform pb-2 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-lg">
                                <div className="rounded-lg">
                                    <div className="mt-3  sm:ml-4 sm:mt-0 sm:text-left">
                                        <div className="mt-2">
                                            <form className="">
                                                <h2 className="text-2xl font-bold text-center mb-6 border py-2 rounded-t-lg">{label}</h2>
                                                <Input label="Title" type="text" name="title" placeholder="Enter Title" value={title} setValue={setTitle}/>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                                    <textarea
                                                        name="description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        required
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                                    <select
                                                        name="status"
                                                        value={status}
                                                        onChange={(e) => setStatus(e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        <option value="">--Select Status</option>
                                                        <option value="INCOMPLETED">Incompleted</option>
                                                        <option value="INPROGRESS">In Progress</option>
                                                        <option value="COMPLETED">Completed</option>
                                                    </select>
                                                </div>
                                                {
                                                    mode==="todo" && 
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                                        <select
                                                            name="priority"
                                                            value={priority}
                                                            onChange={(e) => setPriority(e.target.value)}
                                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                        >
                                                            <option value="">--Select Priority</option>
                                                            <option value="LOW">Low</option>
                                                            <option value="MEDIUM">Medium</option>
                                                            <option value="HIGH">High</option>
                                                        </select>
                                                    </div>
                                                }
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Select Assignee</label>
                                                    <MultiSelect options={options} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
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
                                {
                                    mode==="todo" && 
                                    <button type="button" disabled={disable} onClick={type === "add" ? addTodo : updateTodo} className="mt-3 inline-flex w-full justify-center bg-blue-600 hover:bg-blue-500 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset text-white sm:mt-0 sm:w-auto">Submit</button>
                                }
                                {
                                    mode!=="todo" && 
                                    <button type="button" disabled={disable} onClick={type === "add" ? addSubTodo : updateSubTodo} className="mt-3 inline-flex w-full justify-center bg-blue-600 hover:bg-blue-500 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset text-white sm:mt-0 sm:w-auto">Submit</button>
                                }
                                <button type="button" onClick={() => setVisible(false)} className="w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-black shadow-sm sm:ml-3 hover:bg-gray-5-100 sm:w-auto me-2">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

TodoDialog.propTypes = {
    setVisible: PropTypes.any,
    label: PropTypes.string,
    type: PropTypes.string,
    todo: PropTypes.any,
    mode:PropTypes.string,
    id:PropTypes.string,
    refreshSubTodoData:PropTypes.func,
    setIsSideBar:PropTypes.func,
    refreshTodoData:PropTypes.func
}

export default TodoDialog
