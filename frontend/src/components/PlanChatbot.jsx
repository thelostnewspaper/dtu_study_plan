import React, { useState, useRef, useEffect } from 'react';

export default function PlanChatbot({ currentState, onApplyActions }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      content: "Hello! I'm your DTU Study Plan advisor. Ask me anything about your course planning, like *\"Which cybersecurity courses should I choose?\"* or command me: *\"Add 02225 to semester 2\"* or *\"Remove 02266\"*."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputText
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages,
          currentState: currentState
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: data.text,
        actions: data.actions || []
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.actions && data.actions.length > 0) {
        onApplyActions(data.actions);
      }
    } catch (err) {
      console.error("Error communicating with chatbot server:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: "Sorry, I had trouble communicating with my backend server. Make sure the backend server is running and your `GEMINI_API_KEY` is configured."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to parse simple markdown bold and bullet points into React elements
  const formatMessageContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    let inList = false;
    let listItems = [];
    const elements = [];

    const parseFormatting = (str) => {
      const boldParts = str.split(/\*\*(.*?)\*\*/g);
      return boldParts.flatMap((bPart, bIndex) => {
        const isBold = bIndex % 2 === 1;
        const italicParts = bPart.split(/\*(.*?)\*/g);
        const rendered = italicParts.map((iPart, iIndex) => {
          const isItalic = iIndex % 2 === 1;
          if (isItalic) {
            return <em key={`i-${iIndex}`}>{iPart}</em>;
          }
          return iPart;
        });
        if (isBold) {
          return <strong key={`b-${bIndex}`}>{rendered}</strong>;
        }
        return rendered;
      });
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(<li key={idx}>{parseFormatting(trimmed.substring(2))}</li>);
      } else {
        if (inList) {
          elements.push(<ul key={`list-${idx}`}>{listItems}</ul>);
          inList = false;
        }
        if (trimmed) {
          elements.push(<p key={idx}>{parseFormatting(line)}</p>);
        }
      }
    });

    if (inList) {
      elements.push(<ul key="list-final">{listItems}</ul>);
    }

    return elements;
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <div>
          <h3>Study Plan AI Advisor</h3>
          <span className="chat-header-desc">Gemini 2.5 Flash</span>
        </div>
      </div>

      <div className="chatbot-body">
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message-bubble message-${msg.sender}`}>
              <div>{formatMessageContent(msg.content)}</div>
              {msg.actions && msg.actions.map((act, i) => (
                <span key={i} className="message-action-tag">
                  [Action Applied] {act.type}: {act.code} {act.sem ? `(${act.sem})` : ''}
                </span>
              ))}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              Advisor is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask advice or type plan commands..."
            className="chat-input"
            style={{ height: '80px', resize: 'none', padding: '8px' }}
            disabled={isTyping}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={isTyping || !inputText.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
