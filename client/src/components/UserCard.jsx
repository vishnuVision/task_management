import PropTypes from "prop-types"
import { Link } from "react-router-dom"

function UserCard({user,className=""}) {
  return (
    <Link className={`flex flex-grow py-4 ${className}`} to={`/userTodo/${user._id}`}>
       <div className="flex justify-center items-center mb-2 mx-2 gap-4">
            <img data-tooltip-target="tooltip-default" src={user?.avatar} className="w-10 h-10 rounded-full" alt="User Avatar" />
            <p>{user?.username}</p>
        </div>
    </Link>
  )
}

UserCard.propTypes = {
    user:PropTypes.object,
    className:PropTypes.string
}

export default UserCard
