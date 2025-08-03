import React, { useState, useContext } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { Context } from '../../Context/Context'

const Sidebar = () => {

    const [extended, setExtended] = useState(false)
    const {onSent, userChats, loadChat, newChat, deleteChat} = useContext(Context)
    
    const loadPrompt = async (chatId) =>{
        await loadChat(chatId)
    }

    const handleDeleteChat = async (chatId, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this chat?')) {
            await deleteChat(chatId);
        }
    }


  return (
    <div className='sidebar'>
        <div className="top">   
            <img onClick={()=>setExtended(prev=>!prev)} className='menu' src={assets.menu_icon} alt="menu" />
            <div onClick={()=>newChat()} className="new-chat">
                <img src={assets.plus_icon} alt="plus" />
                {extended?<p>New chat</p>:null}
            </div>
            {extended
                ?<div className="recent">
                    <p className="recent-title">Recent Chats</p>
                    {userChats.map((chat,index)=>{
                        return (
                            <div key={chat.id} onClick={()=>loadPrompt(chat.id)} className="recent-entry">
                                <img src={assets.message_icon} alt="message" />
                                <p>{chat.title || `New Chat`}</p>
                                <button 
                                    onClick={(e) => handleDeleteChat(chat.id, e)}
                                    className="delete-chat-btn"
                                    title="Delete chat"
                                >
                                    ×
                                </button>
                            </div>
                        )
                    })}
                </div>
                :null
            }
            
        </div>
        <div className="bottom">
            <div className="bottom-item recent-entry">
                <img src={assets.question_icon} alt="question-icon" />
                {extended?<p>Help</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.history_icon} alt="question-icon" />
                {extended?<p>Activity</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.setting_icon} alt="question-icon" />
                {extended?<p>Setting</p>:null}
            </div>
        </div>
    </div>
  )
}

export default Sidebar