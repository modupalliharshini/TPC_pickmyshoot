import React, { useState, useEffect, useRef } from 'react';

export default function WhatsAppChat({ isOpen, onClose, photographer }) {
  if (!isOpen || !photographer) return null;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Initialize with greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init',
          text: `Hi! Thanks for checking out ${photographer.name}. Which date are you planning your shoot for? 😊`,
          isIncoming: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [photographer]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      text,
      isIncoming: false,
      time
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated reply from photographer
    setTimeout(() => {
      setIsTyping(false);
      
      let replyText = '';
      if (text.toLowerCase().includes('wedding') || text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
        replyText = `Our packages start from ₹${(photographer.price || 15000).toLocaleString('en-IN')}! For custom quotes, please share details like hours and event counts. I can email a quote catalog to you!`;
      } else if (text.match(/\b\d{4}\b/)) {
        replyText = `That date is currently open for booking, but we've received other inquiries for the same weekend. Would you like me to send a lock-in slot estimate?`;
      } else {
        replyText = `Perfect! We have customized packages for that. Would you like to schedule a quick phone call to align on details? Let me know your phone number.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: replyText,
          isIncoming: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`whatsapp-chat-container ${isOpen ? 'show' : ''}`} id="whatsapp-chat-panel" style={{ display: 'flex' }}>
      <div className="chat-header">
        <div className="chat-header-left">
          <div 
            className="chat-avatar" 
            style={{ 
              backgroundColor: photographer.avatarColor || '#075e54',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {photographer.avatarText || 'KR'}
          </div>
          <div className="chat-title-status">
            <span className="chat-name" id="chat-header-name">{photographer.name}</span>
            <span className="chat-status">Online</span>
          </div>
        </div>
        <button className="chat-close-btn" id="chat-close" onClick={onClose} aria-label="Close WhatsApp chat">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      {/* Chat log wrapper */}
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.isIncoming ? 'incoming' : 'outgoing'}`}>
            {m.text}
            <span className="chat-time">{m.time}</span>
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble incoming">
            <i className="fa-solid fa-ellipsis fa-bounce"></i>
          </div>
        )}
      </div>
      
      <div className="chat-footer">
        <input 
          type="text" 
          className="chat-input" 
          id="chat-msg-input" 
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" id="chat-send-btn" onClick={handleSend} aria-label="Send message">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
