import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from './MyContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const Chat = () => {
  const { prevChats, newChat, reply} = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
if(reply === null){
  setLatestReply(null);
  return;
}

 if(!prevChats?.length) return;

const content = reply.split(' ');

let idx = 0;
const interval = setInterval(() => {
  setLatestReply(content.slice(0, idx+1).join(" "));
  idx++;
  if(idx >= content.length) clearInterval(interval);

}, 40);
return () => clearInterval(interval);
  }, [prevChats, reply])

  return (
    <div className='flex flex-col w-full gap-2 p-2 '>
      {newChat && <h1 className='text-2xl font-semibold'>Start a New Chat!</h1>}

      {prevChats?.slice(0, -1).map((chat, idx) => (
        <div 
          key={idx} 
          className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {chat.role === "user" ? (
            <div className='w-fit bg-[#323232] rounded-2xl px-4 py-2 text-left'>
              {chat.content}
            </div>
          ) : (
            <div className='prose prose-invert max-w-none text-left'>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ))}


      {
        prevChats.length > 0 && (
          <> {
            latestReply === null ? (
 <div className='prose prose-invert max-w-none text-left'>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {prevChats[prevChats.length-1].content}
              </ReactMarkdown>
            </div>
            ) : (
                <div className='prose prose-invert max-w-none text-left'>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {latestReply}
              </ReactMarkdown>
            </div>
            )
          }
          </>
        )
      }

  
    </div>
  )
}

export default Chat