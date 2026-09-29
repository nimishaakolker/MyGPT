import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from './MyContext'
import { v1 as uuidv1 } from 'uuid'

const Sidebar = () => {
  const { allThreads, setAllThreads, currThreadId, newChat, setNewChat, setReply, setPrevChats, setCurrThreadId, setPrompt } = useContext(MyContext);


  const getAllThreads = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/thread');
      const res = await response.json();
      const filterdData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
      setAllThreads(filterdData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllThreads();
  }, [currThreadId])

  const createNewChat = () => {
    setNewChat(true);
    setPrompt('');
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    
    try {
      let response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null)
    } catch (error) {
      console.log(error);
    }
  }

  const deleteThread = async (threadId) => {
   try {
        const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
      method: 'DELETE'
    });

    const res = await response.json();
    console.log(res);
     setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
 if(threadId === currThreadId){
  createNewChat();
 }
   } catch (error) {
    console.log(error);
   }

  }

  return (
    <section className='bg-[#171717] text-[#ececec] h-screen w-80 p-3 flex flex-col'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold w-full text-xl p-3'>MyGPT</h3>
      </div>

      <button className='rounded m-2 p-2 hover:bg-neutral-400/5 flex items-center'
        onClick={createNewChat}>
        <span className='px-2'><i className="fas fa-edit"></i></span>
        <span className='flex flex-1 items-center'>New Chat</span>
      </button>

      <div className='flex-1'>
        <h4 className='p-3 font-semibold'>Chats</h4>

        <div className='text-[#b4b4b4]'>
          {allThreads?.map((thread, idx) => (
            <div
              key={idx}
              className='group flex flex-row items-center gap-2 cursor-pointer hover:bg-neutral-400/5 '>
              <p onClick={() => changeThread(thread.threadId)}
                className='overflow-hidden whitespace-nowrap flex-1 p-1'>{thread.title}</p>
              <span onClick={() => deleteThread(thread.threadId)}
              className='items-center justify-center opacity-0 group-hover:opacity-100 text-[#ffffff] hover:text-red-600'>
                <i className='fa fa-trash'></i>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className='w-full bg-white/25 h-0.5'></div>
        <p className='p-2.5'>By Nimisha &hearts;</p>
      </div>
    </section>
  )
}

export default Sidebar