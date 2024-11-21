import { userSockets } from "../app.js"

const getMemberSocket = (members) => {
    return members.map(member => userSockets.get(member.toString()));
}

const emitEvent = (req , event , data , member) => {
    const io = req.app.get("io");
    const memberSockets = getMemberSocket(member);
    io.to(memberSockets).emit(event , data);
}

export {
    getMemberSocket,
    emitEvent
}