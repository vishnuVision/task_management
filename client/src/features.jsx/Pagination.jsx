import { useState } from 'react';
import PropTypes from 'prop-types';

function Pagination({page,setPage,completedList=[],inCompletedList=[],inProgressList=[]}) {

    const [start,setStart] = useState(1);
    const [end,setEnd] = useState(10);

    const decreasePage = () => {
        setPage(prev=>prev - 1);
        if(page === 1 || page<1)
        {
        setPage(1);
        }
        if(page%10==1 && start > 1)
        {
        setEnd(start-1);
        setStart(start-10);
        }
    }
    
    const increasePage = () => {
        if(completedList.length > 0 || inCompletedList.length > 0 || inProgressList.length > 0)
        {
            setPage(prev=>prev+1);
            if(page === 1)
            {
            setPage(2);
            }
            if(page%10==0)
            {
            setStart(end+1);
            setEnd(end+10);
            }
        }
        else
        {
            setPage(1);
        }
    }

    const handlePagination = (page) => {
      setPage(page);
    }

  return (
    <div>
        <div className="flex justify-center my-2">
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button onClick={decreasePage} href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span className="sr-only">Previous</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </button>

            <button onClick={()=>handlePagination(start)} href="#" aria-current="page" className={`${page === start ? "bg-indigo-600 text-white" : "text-gray-900"} inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-semibold  ring-1 ring-inset ring-gray-300`}>{start}</button>
            <button onClick={()=>handlePagination(start+1)} className={`${page === start+1 ? "bg-indigo-600 text-white" : "text-gray-900"} inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300`}>{start+1}</button>
            <button onClick={()=>handlePagination(start+2)} className={`${page === start+2 ? "bg-indigo-600 text-white" : "text-gray-900"} inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300`}>{start+2}</button>
            <span className="relative inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
            <button onClick={()=>handlePagination(end-2)} className={`${page === end-2 ? "bg-indigo-600 text-white" : "text-gray-900"} inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300`}>{end-2}</button>
            <button onClick={()=>handlePagination(end-1)} className={`${page === end-1 ? "bg-indigo-600 text-white" : "text-gray-900"} inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300`}>{end-1}</button>
            <button onClick={()=>handlePagination(end)} className={`${page === end ? "bg-indigo-600 text-white" : "text-gray-900"} inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300`}>{end}</button>

            <button onClick={increasePage} href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span className="sr-only">Next</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
  )
}

Pagination.propTypes = {
    page:PropTypes.number,
    setPage:PropTypes.any,
    completedList:PropTypes.array,
    inCompletedList:PropTypes.array,
    inProgressList:PropTypes.array
}

export default Pagination
