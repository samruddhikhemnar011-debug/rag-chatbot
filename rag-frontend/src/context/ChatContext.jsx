import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

const MOCK_INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    name: 'Sample_RAG_Architecture_Doc.pdf',
    size: '2.4 MB',
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Indexed',
    pageCount: 14,
  },
  {
    id: 'doc-2',
    name: 'User_Manual_v2.0.pdf',
    size: '1.1 MB',
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'Ready',
    pageCount: 8,
  }
];

const MOCK_INITIAL_CHATS = [
  {
    id: 'chat-1',
    title: 'RAG Architecture Overview',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    pdfName: 'Sample_RAG_Architecture_Doc.pdf',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'What is the main architecture of this RAG system?',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'm2',
        sender: 'bot',
        text: 'The architecture uses FastAPI for backend endpoints, ChromaDB/FAISS vector embeddings for semantic document retrieval, and OpenAI/LLM models for contextual answer generation.',
        pdfName: 'Sample_RAG_Architecture_Doc.pdf',
        chunksRetrieved: 3,
        timestamp: new Date(Date.now() - 3600000 * 4 + 1000).toISOString()
      }
    ]
  },
  {
    id: 'chat-2',
    title: 'User Manual Quick Lookup',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    pdfName: 'User_Manual_v2.0.pdf',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'How do I reset my account password?',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'm4',
        sender: 'bot',
        text: 'To reset your password, navigate to the Settings page and select "Security & Password". Follow the prompt to verify your registered email.',
        pdfName: 'User_Manual_v2.0.pdf',
        chunksRetrieved: 2,
        timestamp: new Date(Date.now() - 86400000 * 2 + 1200).toISOString()
      }
    ]
  }
];

export const ChatProvider = ({ children }) => {
  // Load initial chats from localStorage or fallback to MOCK
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('rag_chats');
      return saved ? JSON.parse(saved) : MOCK_INITIAL_CHATS;
    } catch {
      return MOCK_INITIAL_CHATS;
    }
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return chats.length > 0 ? chats[0].id : null;
  });

  // Load initial documents from localStorage or fallback to MOCK
  const [uploadedDocuments, setUploadedDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('rag_uploaded_docs');
      return saved ? JSON.parse(saved) : MOCK_INITIAL_DOCUMENTS;
    } catch {
      return MOCK_INITIAL_DOCUMENTS;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Save chats to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('rag_chats', JSON.stringify(chats));
    } catch (e) {
      console.error('Failed to save chats to localStorage', e);
    }
  }, [chats]);

  // Save documents to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('rag_uploaded_docs', JSON.stringify(uploadedDocuments));
    } catch (e) {
      console.error('Failed to save documents to localStorage', e);
    }
  }, [uploadedDocuments]);

  // Helper: Get active chat object
  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const messages = activeChat ? activeChat.messages : [];

  // Create a new chat thread
  const createNewChat = useCallback((title = 'New Conversation') => {
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pdfName: uploadedDocuments.length > 0 ? uploadedDocuments[0].name : 'Document.pdf',
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    return newChatId;
  }, [uploadedDocuments]);

  // Select / Switch Chat
  const selectChat = useCallback((chatId) => {
    setActiveChatId(chatId);
  }, []);

  // Rename a chat session
  const renameChat = useCallback((chatId, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle.trim(), updatedAt: new Date().toISOString() } : c));
    toast.success('Chat renamed');
  }, []);

  // Delete a chat session
  const deleteChat = useCallback((chatId) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (activeChatId === chatId) {
        setActiveChatId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
    toast.success('Chat deleted');
  }, [activeChatId]);

  // Add a new message to current active chat
  const addMessageToActiveChat = useCallback((message) => {
    setChats(prev => {
      if (prev.length === 0 || !activeChatId) {
        const newId = `chat-${Date.now()}`;
        const newChat = {
          id: newId,
          title: message.text ? (message.text.length > 30 ? message.text.substring(0, 30) + '...' : message.text) : 'New Conversation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pdfName: uploadedDocuments[0]?.name || 'Document.pdf',
          messages: [{ ...message, id: message.id || Date.now().toString(), timestamp: new Date().toISOString() }]
        };
        setActiveChatId(newId);
        return [newChat, ...prev];
      }

      return prev.map(c => {
        if (c.id === activeChatId) {
          const updatedMessages = [...c.messages, { ...message, id: message.id || Date.now().toString(), timestamp: new Date().toISOString() }];
          const isFirstUserMessage = c.messages.length === 0 && message.sender === 'user';
          return {
            ...c,
            title: isFirstUserMessage && c.title === 'New Conversation' 
              ? (message.text.length > 30 ? message.text.substring(0, 30) + '...' : message.text) 
              : c.title,
            updatedAt: new Date().toISOString(),
            messages: updatedMessages
          };
        }
        return c;
      });
    });
  }, [activeChatId, uploadedDocuments]);

  // Clear current active chat messages
  const clearChat = useCallback(() => {
    if (activeChatId) {
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [] } : c));
    }
  }, [activeChatId]);

  // Add an uploaded document
  const addDocument = useCallback((doc) => {
    const newDoc = {
      id: doc.id || `doc-${Date.now()}`,
      name: doc.name || doc.filename || 'Uploaded_Document.pdf',
      size: doc.size || '1.5 MB',
      uploadedAt: new Date().toISOString(),
      status: 'Indexed',
      pageCount: doc.pageCount || Math.floor(Math.random() * 15) + 2
    };
    setUploadedDocuments(prev => [newDoc, ...prev]);
  }, []);

  // Rename an uploaded document
  const renameDocument = useCallback((docId, newName) => {
    if (!newName || !newName.trim()) return;
    setUploadedDocuments(prev => prev.map(d => d.id === docId ? { ...d, name: newName.trim() } : d));
    toast.success('PDF renamed');
  }, []);

  // Remove an uploaded document
  const removeDocument = useCallback((id) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success('PDF removed');
  }, []);

  // Send message to the backend POST /api/v1/chat/
  const sendMessage = useCallback(async (questionText) => {
    if (!questionText || !questionText.trim()) return;

    let targetChatId = activeChatId;
    if (!targetChatId || chats.length === 0) {
      targetChatId = createNewChat(questionText.length > 30 ? questionText.substring(0, 30) + '...' : questionText);
    }

    const userMsgId = Date.now().toString();
    const userMessage = {
      id: userMsgId,
      sender: 'user',
      text: questionText.trim(),
      timestamp: new Date().toISOString()
    };

    addMessageToActiveChat(userMessage);
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(questionText.trim());

      if (data.success) {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.answer,
          pdfName: data.pdf_name || uploadedDocuments[0]?.name || 'Document.pdf',
          chunksRetrieved: data.chunks_retrieved,
          timestamp: new Date().toISOString()
        };
        addMessageToActiveChat(botMessage);
      } else {
        const botErrorMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.message || 'Unable to get answer from PDF.',
          isError: true,
          timestamp: new Date().toISOString()
        };
        addMessageToActiveChat(botErrorMessage);
        toast.error(data.message || 'Error processing question');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to send message';

      const botErrorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Error: ${errorMsg}`,
        isError: true,
        timestamp: new Date().toISOString()
      };
      addMessageToActiveChat(botErrorMessage);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, chats, createNewChat, addMessageToActiveChat, uploadedDocuments]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        messages,
        isLoading,
        setIsLoading,
        uploadedDocuments,
        user,
        setUser,
        searchQuery,
        setSearchQuery,
        createNewChat,
        selectChat,
        renameChat,
        deleteChat,
        clearChat,
        addDocument,
        renameDocument,
        removeDocument,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};


