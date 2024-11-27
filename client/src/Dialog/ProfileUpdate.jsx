import axios from "axios";
import Input from "../components/Input";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { assignUser } from "../redux/slices/authReducer";

function ProfileUpdate({ setVisible, user }) {
    const [email, setEmail] = useState(user?.email || "'");
    const [name, setName] = useState(user?.name || "");
    const [username, setUsername] = useState(user.username || "");
    const [avatar, setAvatar] = useState("");
    const [avatarFile, setAvatarFile] = useState(user?.avatar || "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const changeAvatar = async () => {
        setIsLoading(true);
        let toastId = toast.loading("User Creating...");
        if (!avatar) {
            setError("Please Select Avatar");
        }
        else {
            try {
                const formdata = new FormData();
                formdata.append("avatar", avatar);
                const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateAvatar`, formdata, {
                    withCredentials: true,
                })

                if (response.data) {
                    const { success, message, data } = response.data;

                    if (success) {
                        setAvatarFile(data.avatar);
                        toast.success(message, { id: toastId });
                    }
                    else {
                        toast.error(message, { id: toastId });
                    }
                }
            } catch (error) {
                if (!error?.response?.data?.success) {
                    toast.error(error.response.data.message, { id: toastId });
                }
            }
        }
        setIsLoading(false);
    }

    const handleSubmit = async () => {
        let toastId = toast.loading("User Creating...");
        if (!email || !username || !name) {
            setError("Please fill all fields");
        }
        else {
            try {
                const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/updateUser`, { email, username, name }, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if (response.data) {
                    const { success, message, data } = response.data;

                    if (success) {
                        dispatch(assignUser(data));
                        toast.success(message, { id: toastId });
                    }
                    else {
                        toast.error(message, { id: toastId });
                    }
                }
            } catch (error) {
                if (!error?.response?.data?.success) {
                    toast.error(error.response.data.message, { id: toastId });
                }
            }
        }
        setVisible(false);
    }

    useEffect(() => {
        if (avatar) {
            changeAvatar();
        }
    }, [avatar])

    return (
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
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={avatarFile}
                                                alt="User Avatar"
                                                className={`w-32 h-32 rounded-full shadow-md object-cover ${isLoading ? "opacity-25" : ""}`}
                                            />
                                            <label htmlFor="avatar" className="mt-4 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                                                Change Avatar
                                                <input id="avatar" onChange={(e) => setAvatar(e.target.files[0])} type="file" className="hidden" />
                                            </label>
                                        </div>
                                        <form className="">
                                            <Input label="Username" type="text" name="username" placeholder="Enter Username" value={username} setValue={setUsername} />
                                            <Input label="Name" type="text" name="name" placeholder="Enter Name" value={name} setValue={setName} />
                                            <Input label="Email" type="email" name="email" placeholder="Enter Email" value={email} setValue={setEmail} />
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
                            <button onClick={handleSubmit} type="button" className="mt-3 inline-flex w-full justify-center bg-blue-600 hover:bg-blue-500 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset text-white sm:mt-0 sm:w-auto">Submit</button>
                            <button onClick={() => setVisible(false)} type="button" className="w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-black shadow-sm sm:ml-3 hover:bg-gray-5-100 sm:w-auto me-2">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

ProfileUpdate.propTypes = {
    setVisible: PropTypes.any,
    user: PropTypes.any
}

export default ProfileUpdate
