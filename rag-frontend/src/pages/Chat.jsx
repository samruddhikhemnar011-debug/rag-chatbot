import React from 'react';
import ChatBox from '../components/ChatBox';

const Chat = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden glass-card rounded-xl border border-gray-200 dark:border-dark-border shadow-md">
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
