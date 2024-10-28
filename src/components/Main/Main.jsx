import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../Context/context'
const Main = () => {

    const {onSent,recentPrompt,showResult,loading,resultData,setInput,input,loadPrompt,prevPrompts, setRecentPrompt} = useContext(Context)

  return (
    <div className='main'>
        <div className="nav">
            <p>Gemini</p>
            <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">

            {!showResult 
            ?<>
                <div className="greet">
                <p><span>Hello, Abhi.</span></p>
                <p>How can I help you today?</p>
            </div>
            <div className="cards">
            
                <div onClick={() => {
                    const newInput = 'Suggest beautiful places to see on an upcoming road trip';
                    
                    setInput(newInput);
                    
                    setRecentPrompt(newInput); 
                    prevPrompts.push(newInput); 
                    
                    onSent(newInput);
                }}  className="card">
                    <p>Suggest beautiful places to see on an upcoming road trip</p>
                    <img src={assets.compass_icon} alt="" />
                </div>
                <div className="card">
                    <p>Briefly summarise this concept: urban planning</p>
                    <img src={assets.bulb_icon} alt="" />
                </div>
                <div className="card">
                    <p>Brainstrom team bonding activities for our work retreat</p>
                    <img src={assets.message_icon} alt="" />
                </div>
                <div className="card">
                    <p>Improve the readability of the following code</p>
                    <img src={assets.code_icon} alt="" />
                </div>
            </div>
            </>
            : <div className="result">
                <div className="result-title">
                    <img src={assets.user_icon} alt="" />
                    <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                    <img src={assets.gemini_icon} alt="" />
                    {loading
                    ?<div className="loader">
                        {/* <hr />
                        <hr />
                        <hr /> */}
                        <div className="inner one"></div>
                        <div className="inner two"></div>
                        <div className="inner three"></div>
                    </div>
                    : <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                    }
                </div>
            </div>
            }

            
            <div className="main-bottom">
                {/* <div className="search-box">
                    <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here'/>
                    <div>
                        <img src={assets.gallery_icon} alt="gallery" />
                        <img src={assets.mic_icon}alt="mic" />
                        {input?<img onClick={()=>onSent()} src={assets.send_icon} alt="send" />:null}
                    </div>
                </div> */}

                <div className="search-box">
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                        type="text" 
                        placeholder="Enter a prompt here" 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && input) {
                                e.preventDefault(); // Prevents default form submission or other Enter key behavior
                                onSent(); // Calls onSent() if input has a value
                            }
                        }} 
                    />
                    <div>
                        <img src={assets.gallery_icon} alt="gallery" />
                        <img src={assets.mic_icon} alt="mic" />
                        {input ? (
                            <img 
                                onClick={() => onSent()} 
                                src={assets.send_icon} 
                                alt="send" 
                                style={{ cursor: 'pointer' }} // Optional: cursor pointer for clarity
                            />
                        ) : null}
                    </div>
                </div>

                <p className="bottom-info">
                    Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                </p>
            </div>
        </div>
    </div>
  )
}

export default Main