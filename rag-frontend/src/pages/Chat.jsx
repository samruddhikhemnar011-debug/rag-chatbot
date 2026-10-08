import React from 'react';
import ChatBox from '../components/ChatBox';

const Chat = () => {
  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col animate-fade-in">
      <div className="flex-1 flex overflow-hidden glass-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-xl">
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
