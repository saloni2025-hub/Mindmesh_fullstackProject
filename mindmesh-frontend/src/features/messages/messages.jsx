// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { MessageSquare } from 'lucide-react';
// import Inbox from './Inbox.jsx';
// import ChatWindow from './ChatWindow';
// import { conversations } from './messageData.jsx'

// function Messages() {
//   const { chatId } = useParams();
//   const [chats, setChats] = useState(conversations);

//   // Chat khulte hi unread badge hata do
//   useEffect(() => {
//     if (!chatId) return;
//     setChats((prev) =>
//       prev.map((c) => (c.username === chatId ? { ...c, unread: 0 } : c))
//     );
//   }, [chatId]);

//   const handleSend = (username, text) => {
//     const newMessage = {
//       id: Date.now(),
//       from: 'me',
//       text,
//       time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
//     };
//     setChats((prev) =>
//       prev.map((c) =>
//         c.username === username ? { ...c, messages: [...c.messages, newMessage] } : c
//       )
//     );
//   };

//   const activeChat = chats.find((c) => c.username === chatId);

//   return (
//     <div className="max-w-7xl mx-auto h-[calc(100vh-61px)] flex overflow-hidden border-x border-zinc-800">
//       {/* Left: inbox (mobile pe chat khuli ho toh chhup jaye) */}
//       <div className={`${chatId ? 'hidden md:flex' : 'flex'} w-full md:w-96 shrink-0 border-r border-zinc-800`}>
//         <Inbox chats={chats} activeId={chatId} />
//       </div>

//       {/* Right: chat window ya empty state */}
//       <div className={`${chatId ? 'flex' : 'hidden md:flex'} flex-1 min-w-0`}>
//         {chatId && activeChat ? (
//           <ChatWindow chat={activeChat} onSend={handleSend} />
//         ) : (
//           <div className="flex flex-col items-center justify-center w-full text-center px-6">
//             <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
//               <MessageSquare className="text-orange-500" size={28} />
//             </div>
//             <h2 className="text-white font-semibold text-lg mb-1">
//               {chatId ? 'Conversation not found' : 'Select a conversation'}
//             </h2>
//             <p className="text-zinc-500 text-sm">
//               {chatId
//                 ? 'This chat does not exist yet.'
//                 : 'Pick a peer from the list to start chatting.'}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Messages;
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Inbox from './Inbox';
import ChatWindow from './ChatWindow';
import { api } from '../../lib/api';

function Messages() {
  const { chatId } = useParams();
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const [activeError, setActiveError] = useState('');

  const loadChats = useCallback(async () => {
    try {
      const d = await api.get('/messages');
      setChats(d.conversations);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadActive = useCallback(async () => {
    if (!chatId) return;
    try {
      const d = await api.get(`/messages/${chatId}`);
      setActive({ ...d.peer, messages: d.messages });
      setActiveError('');
    } catch (e) {
      setActiveError(e.message);
    }
  }, [chatId]);

  // inbox list: refresh every 5s
  useEffect(() => {
    loadChats();
    const t = setInterval(loadChats, 5000);
    return () => clearInterval(t);
  }, [loadChats]);

  // open chat: load now, then poll every 4s for new messages
  useEffect(() => {
    setActive(null);
    setActiveError('');
    loadActive().then(loadChats);
    const t = setInterval(loadActive, 4000);
    return () => clearInterval(t);
  }, [loadActive, loadChats]);

  const handleSend = async (username, text) => {
    try {
      const d = await api.post(`/messages/${username}`, { text });
      setActive((prev) => (prev ? { ...prev, messages: [...prev.messages, d.message] } : prev));
      loadChats();
    } catch (e) {
      setActiveError(e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-61px)] flex overflow-hidden border-x border-zinc-800">
      <div className={`${chatId ? 'hidden md:flex' : 'flex'} w-full md:w-96 shrink-0 border-r border-zinc-800`}>
        <Inbox chats={chats} activeId={chatId} />
      </div>

      <div className={`${chatId ? 'flex' : 'hidden md:flex'} flex-1 min-w-0`}>
        {chatId && active ? (
          <ChatWindow chat={active} onSend={handleSend} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full text-center px-6">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="text-orange-500" size={28} />
            </div>
            <h2 className="text-white font-semibold text-lg mb-1">
              {activeError ? 'Conversation not found' : chatId ? 'Loading...' : 'Select a conversation'}
            </h2>
            <p className="text-zinc-500 text-sm">
              {activeError || (chatId ? '' : 'Pick a peer from the list, or message someone from Discover.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;