import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Chatwindow from './Chatwindow'
import './App.css'
import { MyContext } from './MyContext'
import { v1 as uuidv1 } from 'uuid'
import Login from './Login'
import Signup from './Signup'

function App() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [showSignup, setShowSignup] = useState(false);   // <-- added

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    accessToken, setAccessToken
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setAccessToken(data.accessToken))
        .catch(() => {})
  }, [])

  return (
    <>
      <div className='bg-[#212121] flex text-[#ececec] w-full h-screen '>
        <MyContext.Provider value={providerValues}>
          {accessToken ? (
            <>
              <Sidebar />
              <Chatwindow />
            </>
          ) : showSignup ? (
            <Signup switchToLogin={() => setShowSignup(false)} />
          ) : (
            <Login switchToSignup={() => setShowSignup(true)} />
          )}
        </MyContext.Provider>
      </div>
    </>
  )
}

export default App