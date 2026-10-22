import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Video } from 'lucide-react';
import RequestSessionModal from '../schedule/RequestSessionModal';
import { formatMessageTime } from '../../lib/Format';

function ChatWindow({ chat, onSend }) {
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const bottomRef = useRef(null);

  // Naya message aane pe ya chat badalne pe neeche scroll karo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages.length, chat.username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(chat.username, trimmed);
    setText('');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Link to="/messages" className="md:hidden text-zinc-400 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="relative">
            <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
            {chat.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></span>
            )}
          </div>
          <div>
            <h2 className="text-white font-semibold leading-tight">{chat.name}</h2>
            <p className="text-xs text-zinc-500">{chat.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${chat.username}`}
            className="border border-zinc-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
          >
            View Profile
          </Link>
          <button className="flex sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition">
            <Video size={14} />
            Request Session
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {chat.messages.map((msg) => {
          const isMe = msg.from === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[75%]">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'bg-zinc-800 text-white rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <p className={`text-xs text-zinc-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                 {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-t border-zinc-800">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
      {showModal && <RequestSessionModal peer={chat} onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default ChatWindow;