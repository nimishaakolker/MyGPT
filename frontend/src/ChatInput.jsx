import React, { useContext } from 'react'
import { MyContext } from './MyContext'

const ChatInput = ({ getReply, loading }) => {
  const { prompt, setPrompt } = useContext(MyContext);

  return (
    <div className='relative flex w-full max-w-[700px] mx-auto px-4'>
      <input
        type="text"
        placeholder='Ask anything'
        className='h-14 m-2 p-2 pr-12 w-full bg-white/5 rounded-2xl outline-0 shadow-[0_54px_55px_rgba(0,0,0,0.05),0_-12px_30px_rgba(0,0,0,0.05),0_4px_6px_rgba(0,0,0,0.05),0_12px_3px_rgba(0,0,0,0.05),0_-3px_5px_rgba(0,0,0,0.05)]'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !loading ? getReply() : ''}
      />
      <span onClick={loading ? undefined : getReply}
        className={`absolute right-10 top-1/2 -translate-y-1/2 hover:text-white transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <i className='fa-solid fa-paper-plane'></i>
      </span>
    </div>
  )
}

export default ChatInput