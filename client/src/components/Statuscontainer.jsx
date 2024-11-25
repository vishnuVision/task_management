import { useEffect, useState } from "react";
import Todocard from "./Todocard";
import PropTypes from "prop-types";

function Statuscontainer({ title="",length=0,todoList=[]}) {
  const [updatedToDoist,setUpdatedToDoList]= useState([]);

  useEffect(()=>{
    setUpdatedToDoList([...todoList.filter(({priority})=>priority==="HIGH"),...todoList.filter(({priority})=>priority==="MEDIUM"),...todoList.filter(({priority})=>priority==="LOW")]);
  },[todoList])
  
  return (
    <div className={`flex flex-col flex-grow max-w-lg ${length === 0 ? "bg-gradient-to-b from-slate-100" :""} mt-5 px-4`}>  
      <div className="flex justify-center gap-3 p-4">
        <p>{title}</p>
        <p className="bg-slate-200 rounded-full px-2">{length}</p>
      </div>
      <hr />
      <div key={Math.random()} className={`${length === 0 ? "justify-center" : ""}flex items-center flex-col p-4 flex-grow mx-2 gap-4`}>
        {
          length === 0 && (
            <div className="flex justify-center items-center">No more Todos</div>
          )
        }
        {
          updatedToDoist && updatedToDoist.length > 0 &&  updatedToDoist.map(({_id,title,description,priority,status,owner},idx)=>(
            <>
              <Todocard key={idx} _id={_id} title={title} description={description} priority={priority} status={status} owner={owner}/>
            </>
          ))
        }
      </div>
    </div>
  )
}

Statuscontainer.propTypes = {
  title:PropTypes.string,
  length:PropTypes.number,
  todoList:PropTypes.array,
}

export default Statuscontainer;
