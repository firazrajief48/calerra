import React, { useContext, useEffect, useRef } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import { dataContext } from '../../context/UserContext';
import Darkmode from '../Darkmode/Darkmode';
import user from "../../assets/user.png";
import ai from "../../assets/ai.png";
import "./ChatSection.css";

function ChatSection() {
  const { sent, input, setInput, showResult, resultData, currentSession, loading } = useContext(dataContext);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (input.trim() !== "" && !loading) {
      sent(input);
      setInput("");
      setTimeout(() => {
        inputRef.current && inputRef.current.focus();
      }, 100);
    }
  };

  // Auto-scroll ke bawah saat currentSession berubah
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession, loading]);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <div className='chatsection'>
      <div className="topsection">
        {!showResult ? (
          <div className="headings">
            <span>SELAMAT DATANG</span>
            <span>Aku adalah Asisten Diet Sehatmu</span>
            <span>Ada yang bisa ku bantu?</span>
          </div>
        ) : (
          <div className='result'>
            {currentSession.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="userbox">
                  <img src={user} alt="" width="50px" />
                  <div>
                    <p>{item.question}</p>
                    <span className="timestamp">{item.time}</span>
                  </div>
                </div>
                <div className="aibox">
                  <img src={ai} alt="" width="50px" />
                  <div>
                    <p className="text-white whitespace-pre-line">{item.answer}</p>
                    <span className="timestamp">{item.time}</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
            {loading && (
              <div className="aibox">
                <img src={ai} alt="" width="50px" />
                <div className='loader'>
                  <hr /><hr /><hr />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>
      <div className="bottomsection">
        <input
          ref={inputRef}
          type="text"
          placeholder='Tulis pertanyaan diet sehatmu di sini...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              handleSend();
            }
          }}
          disabled={loading}
        />
        {input && !loading && (
          <button id="sendbtn" onClick={handleSend}>
            <LuSendHorizontal />
          </button>
        )}
        <Darkmode />
      </div>
    </div>
  );
}

export default ChatSection;
