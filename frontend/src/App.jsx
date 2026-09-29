import { useState } from 'react'
import Sidebar from './Sidebar'
import Chatwindow from './Chatwindow'
import Chat from './Chat'
import './App.css'
import { MyContext } from './MyContext'
import {v1 as uuidv1} from 'uuid'

function App() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const providerValues = { 
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats,setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads
  };
  return (
    <>
     <div className='bg-[#212121] flex text-[#ececec] w-full h-screen '>
  
      <MyContext.Provider value={providerValues}>
      <Sidebar />
      <Chatwindow />
      </MyContext.Provider>
  
     </div>

    
    </>
  )
}

export default App
