import { useContext, useEffect } from "react";
import Statuscontainer from "./Statuscontainer";
import getDetails from "../context/useContext";
import { useSelector } from "react-redux";
import { v4 as uuid } from 'uuid';
import Pagination from "../features.jsx/Pagination";

function TodoDashBoard() {

  const { completedList, inCompletedList, inProgressList, refreshData, page ,setPage } = useContext(getDetails);
  const { user } = useSelector(state => state.authReducer);

  useEffect(()=>{
    refreshData(page);
  },[page])

  return (
    <div className="flex flex-col mt-16 ms-4 flex-grow justify-evenly">
      <div className="mt-2">
        <div className="flex justify-between mx-4 mt-2 flex-wrap gap-2 mb-2">
          <h1 className="text-lg md:text-2xl font-bold"><span className="text-red-400">Welcome, </span>{user?.name}</h1>
        </div>
      </div>  
      <div className="flex flex-wrap justify-evenly flex-grow mx-8 gap-4">
        <Statuscontainer title="Completed" length={completedList.length} todoList={completedList} />
        <Statuscontainer title="InProgress" length={inProgressList.length} todoList={inProgressList} />
        <Statuscontainer key={uuid()} title="InCompleted" length={inCompletedList.length} todoList={inCompletedList} />
      </div>
      <Pagination page={page} setPage={setPage} completedList={completedList} inCompletedList={inCompletedList} inProgressList={inProgressList}/>
    </div>

  )
}

export default TodoDashBoard