import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { formatMessageTime } from '../../lib/Format';

function Inbox({ chats, activeId }) {
    const [query, setQuery] = useState('');

    const filtered = chats.filter((chat) =>
        chat.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col w-full">
            <div className="p-5 border-b border-zinc-800">
                <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filtered.map((chat) => {
                    const lastMessage = chat.lastMessage;
                    const isActive = chat.username === activeId;

                    return (
                        <Link
                            key={chat.username}
                            to={`/messages/${chat.username}`}
                            className={`flex items-center gap-3 px-5 py-4 border-b border-zinc-900 transition ${isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/60'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                                {chat.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-white font-semibold truncate">{chat.name}</h3>
                                    <span className="text-xs text-zinc-500 shrink-0 ml-2">{formatMessageTime(lastMessage.createdAt)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-0.5">
                                    <p className={`text-sm truncate ${chat.unread > 0 ? 'text-white' : 'text-zinc-400'}`}>
                                        {lastMessage.from === 'me' ? 'You: ' : ''}
                                        {lastMessage.text}
                                    </p>
                                    {chat.unread > 0 && (
                                        <span className="bg-orange-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center shrink-0 ml-2">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {filtered.length === 0 && (
                    <p className="text-zinc-500 text-sm text-center py-10">No conversations found.</p>
                )}
            </div>
        </div>
    );
}

export default Inbox;