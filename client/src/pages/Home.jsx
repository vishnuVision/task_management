import { useState } from "react";
import TodoDashBoard from "../components/TodoDashBoard";

function Home() {
  const [isFirst,setisFirst] = useState(true);
  return (
    <div className="flex h-screen flex-grow">
      <TodoDashBoard setIsFirst={setisFirst} isFirst={isFirst}/>
    </div>
  )
}

export default Home
