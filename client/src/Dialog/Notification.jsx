import PropTypes from 'prop-types'
import { deassignNotification } from '../redux/slices/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

function Notification({ setVisible,isMobile }) {
    const { notification } = useSelector(state => state.notificationReducer);
    const dispatch = useDispatch();

    console.log(notification);

    const cancelNotificationModal = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/notification`, { withCredentials: true });
          } catch (error) {
            if (!error?.response?.data?.success) {
              toast.error(error.response.data.message);
            }
          }
        setVisible(false);
        dispatch(deassignNotification());
    }
    return (
        <>
            <div className="relative z-40 text-black">
                <div className="fixed bg-slate-600 bg-opacity-30 transition-opacity"></div>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className={`absolute ${isMobile ? "top-20 z-50 w-60" : "top-10 right-60" } transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg`}>
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="flex flex-col">
                                    <div className="mt-3 text-center border py-2 rounded-t-lg">
                                        <h3 className="text-base font-semibold text-gray-900" id="modal-title">Notifications</h3>
                                    </div>
                                    <div className='mt-2 flex flex-col gap-2'>
                                        {
                                            notification.length <= 0 && <div className="bg-gray-50 px-4 py-3 flex justify-center items-center">No Notification</div>
                                        }
                                        {
                                            notification && notification.length > 0 && notification.map((notification, idx) => (
                                                <div key={notification.id} className="bg-gray-100 px-4 py-3 ">
                                                    <div className='flex flex-wrap gap-2 items-center'>
                                                        <span><img src={notification?.owner?.avatar} className={`w-10 h-10 rounded-full`} alt="comment Avatar" /></span>
                                                        <span>{notification?.owner?.username}</span>
                                                        <span>{notification.message}</span>
                                                    </div>
                                                    {
                                                        notification.title && notification.description && <div className='flex flex-col mt-4 bg-white shadow-xl rounded-xl px-2 py-2'>
                                                            <span className='font-bold'>{notification.title}</span>
                                                            <span>{notification.description}</span>
                                                        </div>
                                                    }
                                                    {
                                                        (notification.text || notification.image) &&
                                                        <div key={idx} className="">
                                                            <div className="flex flex-col mt-4 bg-white shadow-xl rounded-xl px-2 py-2">
                                                                {
                                                                    notification?.image &&
                                                                    <div className="flex flex-row gap-5 items-center">
                                                                        <img src={notification?.image} className={`w-20 h-20`} alt="comment Avatar" />
                                                                    </div>
                                                                }
                                                                <p className="break-words">{notification?.text}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button onClick={cancelNotificationModal} type="button" className="inline-flex w-full justify-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto me-2">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

Notification.propTypes = {
    setVisible: PropTypes.any,
    isMobile:PropTypes.bool
}

export default Notification
