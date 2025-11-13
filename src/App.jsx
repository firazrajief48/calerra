import { useContext } from "react"
import ChatSection from "./components/chatSection/ChatSection"
import Separation from "./components/separation/Separation"
import Sidebar from "./components/Sidebar/Sidebar"
import { dataContext } from "./context/UserContext"

function App() {
  return (
    <>
      <Sidebar/>
      <Separation/>
      <ChatSection/>
    </>
  )
}

export default App
