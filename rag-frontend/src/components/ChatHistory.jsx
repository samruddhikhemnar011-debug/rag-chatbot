import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { FiMessageSquare, FiMoreVertical, FiEdit2, FiTrash2, FiClock, FiSearch, FiPlus } from 'react-icons/fi';
import RenameModal from './RenameModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ChatHistory = ({ onSelectChat }) => {
  const { chats, activeChatId, createNewChat, selectChat, renameChat, deleteChat } = useChat();
  const [filter, setFilter] = useState('');
  
  const [editingChat, setEditingChat] = useState(null);
  const [deletingChat, setDeletingChat] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (id) => {
    selectChat(id);
    if (onSelectChat) onSelectChat(id);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & New Chat */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Chat History ({chats.length})
          </h3>
          <button
            onClick={() => createNewChat()}
            className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
          >
            <FiPlus /> New
          </button>
        </div>

        {chats.length > 3 && (
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-800 dark:text-gray-200 text-xs focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* List of Chats */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {filteredChats.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-6">
            {filter ? 'No matching chats.' : 'No chat history yet.'}
          </p>
        ) : (
          filteredChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => handleSelect(chat.id)}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <FiMessageSquare size={16} className={`shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate leading-tight">
                      {chat.title}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 flex items-center gap-1">
                      <FiClock size={10} />
                      {new Date(chat.updatedAt || chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Dropdown menu trigger */}
                <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                    }}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-border"
                  >
                    <FiMoreVertical size={14} />
                  </button>

                  {activeMenuId === chat.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl z-20 py-1 text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            setEditingChat(chat);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border text-left"
                        >
                          <FiEdit2 size={12} className="text-primary-500" />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            setDeletingChat(chat);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                        >
                          <FiTrash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <RenameModal
        isOpen={!!editingChat}
        onClose={() => setEditingChat(null)}
        currentName={editingChat?.title}
        title="Rename Chat"
        onSave={(newTitle) => {
          if (editingChat) {
            renameChat(editingChat.id, newTitle);
          }
        }}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingChat}
        onClose={() => setDeletingChat(null)}
        itemName={deletingChat?.title}
        title="Delete Chat Session"
        onConfirm={() => {
          if (deletingChat) {
            deleteChat(deletingChat.id);
          }
        }}
      />
    </div>
  );
};

export default ChatHistory;
