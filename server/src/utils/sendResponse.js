// const sendRequest = (res,message,status,success,data) => {
//     return res
//     .status(status)
//     .json({success,message,data})
// }

// export 
// {
//     sendRequest
// }

const cookieOption = {
    maxAge:24*60*60*1000,
    httpOnly:true,
    sameSite:"none",
    secure:true
}

const sendResponse = (res,status,message,success,data,userToken,isAdmin) => {
    if(!userToken)
    {
        return res
        .status(status)
        .json({
            success,
            message,
            data
        })
    }
    else
    {
        if(isAdmin)
        {
            return res
            .status(status)
            .cookie("adminToken",userToken,cookieOption)
            .json({
                success,
                message,
                data
            })
        }
        else
        {
            return res
            .status(status)
            .cookie("userToken",userToken,cookieOption)
            .json({
                success,
                message,
                data
            })
        }
    }
}

export {
    sendResponse
}