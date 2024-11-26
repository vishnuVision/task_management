import PropTypes from "prop-types";

function TableRow({task, index, setIsVisible, setTodoData, getComments, getSubTasks, users, isVisible}) {

    const handleSideBar = (task) => {
        if (isVisible) {
            setIsVisible(false);
            setTodoData([]);
        }
        else {
            const owner = task?.owner;
            const userDetails = owner.map((id) => {
                const user = users.find((user) => user._id === id);
                return { avatar: user?.avatar, username: user?.username };
            });
            setTodoData({ ...task, avatar: userDetails });
            setIsVisible(true);
            getComments(task._id)
            getSubTasks(task._id);
        }
    }

    return (
        <tr
            className="hover:bg-slate-200 cursor-pointer"
            onClick={() => handleSideBar(task)}
        >
            <th>{index + 1}</th>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td
                className={`${task.status === "Completed" && "line-through"
                    } ${task.status === "Pending" && "text-error"} ${task.status === "Ongoing" && "text-warning"
                    }`}
            >
                {task.status}
            </td>
            <td
                className={`${task.type === "Important" && "text-info"} ${task.type === "Normal" &&
                    "text-gray-900 dark:text-gray-400"
                    }`}
            >
                {task.priority}
            </td>
            <td>
                <div className="flex -space-x-4 mt-2 items-center">
                    {task?.owner?.map((id) => {
                        const user = users.find((user) => user._id === id);
                        return <div key={id} className="relative group">
                            <img src={user?.avatar} className="w-10 h-10 rounded-full border-2 border-black" alt="User Avatar" />
                            <div className="absolute z-10  transform -translate-x-1 bottom-full mb-2 w-max bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {user?.username}
                            </div>
                        </div>
                    })}
                </div>

            </td>
            <td>
                {new Date(task.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
            </td>
        </tr>
    )
}

TableRow.propTypes = {
    task:PropTypes.object, 
    index:PropTypes.number,
    setIsVisible:PropTypes.func,
    setTodoData:PropTypes.func, 
    getComments:PropTypes.func, 
    getSubTasks:PropTypes.func,
    users:PropTypes.any, 
    isVisible:PropTypes.bool
}

export default TableRow
