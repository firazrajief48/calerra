import React, { createContext, useState, useEffect } from 'react';
import run from '../gemini';

export const dataContext = createContext();

function UserContext({ children }) {
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]); // array of session arrays
  const [currentSession, setCurrentSession] = useState([]); // array of {question, answer, time}

  useEffect(() => {
    const savedHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
    setPrevPrompt(savedHistory);
  }, []);

  useEffect(() => {
    if (prevPrompt.length > 0) {
      sessionStorage.setItem('chatHistory', JSON.stringify(prevPrompt));
    }
  }, [prevPrompt]);

  function newChat() {
    setShowResult(false);
    setLoading(false);
    setInput("");
    setResultData("");
    setCurrentSession([]);
  }

  function clearChat() {
    setPrevPrompt([]);
    sessionStorage.removeItem('chatHistory');
  }

  async function sent(input) {
    setResultData("");
    setShowResult(true);
    setLoading(true);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const classifyPrompt = `
        Tentukan apakah pertanyaan berikut berhubungan dengan diet atau tidak. 
        Jika ya, jawab hanya dengan: DIET. 
        Jika tidak, jawab hanya dengan: BUKAN.

        Pertanyaan: "${input}"
      `;

      const classification = await run(classifyPrompt);
      const topik = classification.trim().toUpperCase();
      let answer = "";
      if (topik === "DIET") {
        answer = await run(input);
        answer = answer.replace(/\*/g, '');
      } else {
        answer = "⚠️ Maaf, chatbot ini hanya menjawab pertanyaan seputar diet saja ya~ 🥗💬";
      }
      setCurrentSession(prev => {
        const updated = [...prev, { question: input, answer, time }];
        // Jika ini adalah chat pertama di sesi baru, tambahkan ke prevPrompt
        if (prev.length === 0) {
          setPrevPrompt(p => [...p, updated]);
          sessionStorage.setItem('chatHistory', JSON.stringify([...prevPrompt, updated]));
        } else {
          // Update sesi terakhir di prevPrompt jika sedang dalam sesi
          setPrevPrompt(p => {
            const copy = [...p];
            copy[copy.length - 1] = updated;
            sessionStorage.setItem('chatHistory', JSON.stringify(copy));
            return copy;
          });
        }
        return updated;
      });
      setResultData(answer);
    } catch (error) {
      console.error("❌ Error:", error);
      const answer = "❌ Terjadi kesalahan saat memproses pertanyaan.";
      setCurrentSession(prev => {
        const updated = [...prev, { question: input, answer, time }];
        if (prev.length === 0) {
          setPrevPrompt(p => [...p, updated]);
          sessionStorage.setItem('chatHistory', JSON.stringify([...prevPrompt, updated]));
        } else {
          setPrevPrompt(p => {
            const copy = [...p];
            copy[copy.length - 1] = updated;
            sessionStorage.setItem('chatHistory', JSON.stringify(copy));
            return copy;
          });
        }
        return updated;
      });
      setResultData(answer);
    }
    setLoading(false);
    setInput("");
  }

  const data = {
    input,
    setInput,
    sent,
    loading,
    setLoading,
    showResult,
    setShowResult,
    resultData,
    setResultData,
    prevPrompt,
    setPrevPrompt,
    newChat,
    clearChat,
    currentSession,
    setCurrentSession
  };

  return (
    <dataContext.Provider value={data}>
      {children}
    </dataContext.Provider>
  );
}

export default UserContext;