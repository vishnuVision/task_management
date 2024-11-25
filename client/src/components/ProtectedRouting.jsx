import PropTypes from "prop-types"
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"

function ProtectedRouting({ children }) {
    const { user } = useSelector(state=>state.authReducer);
    
    if(!user)
    {
        return <Navigate to="/login"/>
    }
    else 
    {
        if(children)
        {
            return children;
        }
        else
        {
            return <Outlet/>
        }
    }
}

ProtectedRouting.propTypes = {
    children:PropTypes.any
}

export default ProtectedRouting
