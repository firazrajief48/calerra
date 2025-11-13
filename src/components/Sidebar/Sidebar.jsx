import React, { useContext, useState, useCallback, useEffect } from 'react';
import { IoMenuOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { FiMessageCircle, FiTrash2, FiSearch } from "react-icons/fi";
import "./Sidebar.css";
import { dataContext } from '../../context/UserContext';

function Sidebar() {
    const [extend, setExtend] = useState(true); // default true (desktop)
    const [search, setSearch] = useState("");
    const { prevPrompt, newChat, clearChat, setCurrentSession, setShowResult } = useContext(dataContext);

    // Responsif: extend hanya false di mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 600) {
                setExtend(false);
            } else {
                setExtend(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter berdasarkan pertanyaan pertama dari setiap sesi
    const filteredPrompts = prevPrompt.filter(
        session => session.length > 0 && session[0].question.toLowerCase().includes(search.toLowerCase())
    );

    const handleLoadSession = (session) => {
        setCurrentSession(session);
        setShowResult(true);
    };

    return (
        <div className={`sidebar${extend ? ' active' : ''}`}>
            <div className="sidebar-header">
                <span className="sidebar-logo">Calerra</span>
                <IoMenuOutline id="menu" onClick={() => setExtend(prev => !prev)} />
            </div>
            <div className="sidebar-divider" />
            <div className="newchat" onClick={newChat}>
                <GoPlus />
                {extend && <p>Chat Baru</p>}
            </div>
            <button className="clear-history-btn" onClick={clearChat} title="Hapus semua riwayat">
                <FiTrash2 />
                {extend && <span>Hapus Riwayat</span>}
            </button>
            <div className="sidebar-divider" />
            <div className="search-chat-wrapper">
                <FiSearch className="search-icon" />
                <input
                    className="search-chat"
                    type="text"
                    placeholder="Cari chat..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    disabled={!extend}
                />
            </div>
            {filteredPrompts.map((session, index) => (
                <div className="recent" key={index} onClick={() => handleLoadSession(session)}>
                    <FiMessageCircle />
                    {extend && <p>{session[0]?.question.slice(0, 20) + (session[0]?.question.length > 20 ? '...' : '')}</p>}
                </div>
            ))}
        </div>
    );
}

export default Sidebar;