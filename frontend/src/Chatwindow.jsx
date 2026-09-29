import React, { useContext, useState, useEffect } from 'react'
import Chat from './Chat'
import ChatInput from './ChatInput'
import { MyContext } from './MyContext'
import { ScaleLoader } from 'react-spinners'

const Chatwindow = () => {
  const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, newChat, setNewChat, setPrevChats } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen , setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
 useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prevChats => (
        [...prevChats, {
          role: "user",
          content: prompt
        }, {
          role: "assistant",
          content: reply
        }]
      ))
      setPrompt('');
    }
  }, [reply]);



  const getReply = async () => {
    if (!prompt.trim()) return;

    setNewChat(false);
    setLoading(true);
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: prompt.trim(),
        threadId: currThreadId
      })
    };

    try {
      let response = await fetch('http://localhost:8080/api/thread', options);
      const res = await response.json();

      if (!response.ok) {
        setReply("Something went wrong. Please try again.");
      } else {
        setReply(res.reply);
      }
    } catch (err) {
      console.log(err);
      setReply("Network error. Please check your connection.");
    }
    setLoading(false);
  }

  const toggleProfileMenu = () => {
    setIsOpen(!isOpen);
  }
 

  return (
    <div className='w-full h-screen m-2 p-2 bg-[#212121] flex flex-col items-center text-center'>

      <nav className='flex justify-end w-full items-center relative'>
        <span onClick={toggleProfileMenu}
        className='bg-[#339cff] rounded-full cursor-pointer flex justify-center items-center w-7 h-7'>
          <i className='fa-solid fa-user'></i>
        </span>

        { 
          isOpen && <div className="flex flex-col bg-[#323232] p-2 rounded  absolute z-50 top-10   gap-2">
            <div className='flex gap-2 items-center hover:bg-neutral-100/5 rounded cursor-pointer'><i className='fa-solid fa-gear'></i> Settings</div>
            <div className='flex gap-2 items-center hover:bg-neutral-100/5 rounded cursor-pointer'><i className='fa-solid fa-cloud-arrow-up'></i> Upgrade Plan</div>
            <div className='flex gap-2 items-center hover:bg-neutral-100/5 rounded cursor-pointer'><i className='fa-solid fa-arrow-right-from-bracket'></i> Logout</div>

          </div>
        }
      </nav>

      {newChat ? (
        <div className='flex flex-1 flex-col items-center justify-center w-full'>
          <h1 className='font-semibold text-xl mb-4'>Start a New Chat!</h1>
          <ChatInput getReply={getReply} loading={loading} />
        </div>
      ) : (
        <>
          <div className='flex flex-1 min-h-0 overflow-y-auto scrollbar-hide w-full max-w-[700px] mx-auto flex-col'>
            <Chat />
            {loading && (
              <div className='flex justify-start p-2'>
                <ScaleLoader color='#b4b4b4' height={20} width={3} radius={2} margin={2} />
              </div>
            )}
          </div>

          <div className='flex w-full items-center flex-col'>
            <ChatInput getReply={getReply} loading={loading} />
            <p className='flex p-2 text-center text-xs'>Mygpt can make mistakes. Please double check responses.</p>
          </div>
        </>
      )}

    </div>
  )
}

export default Chatwindow