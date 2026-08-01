import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import PDFCard from './PDFCard';
import RenameModal from './RenameModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { FiFileText, FiSearch, FiFolderPlus } from 'react-icons/fi';

const PDFList = () => {
  const { uploadedDocuments, renameDocument, removeDocument } = useChat();
  const [search, setSearch] = useState('');
  
  // Modals state
  const [editingDoc, setEditingDoc] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(null);

  const filteredDocs = uploadedDocuments.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiFileText className="text-primary-500" />
            Uploaded Documents ({uploadedDocuments.length})
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage your knowledge base PDFs available for AI RAG querying.
          </p>
        </div>

        {uploadedDocuments.length > 0 && (
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PDFs..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* PDF Grid */}
      {filteredDocs.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center border border-dashed border-gray-300 dark:border-dark-border">
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-500 mx-auto flex items-center justify-center text-2xl mb-3">
            <FiFolderPlus />
          </div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
            {search ? 'No matching documents found' : 'No documents uploaded yet'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {search ? 'Try clearing your search query' : 'Upload your first PDF document to start querying it with AI.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <PDFCard
              key={doc.id}
              doc={doc}
              onRename={(d) => setEditingDoc(d)}
              onDelete={(d) => setDeletingDoc(d)}
            />
          ))}
        </div>
      )}

      {/* Rename Modal */}
      <RenameModal
        isOpen={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        currentName={editingDoc?.name}
        title="Rename Document"
        onSave={(newName) => {
          if (editingDoc) {
            renameDocument(editingDoc.id, newName);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        itemName={deletingDoc?.name}
        title="Delete Document"
        onConfirm={() => {
          if (deletingDoc) {
            removeDocument(deletingDoc.id);
          }
        }}
      />
    </div>
  );
};

export default PDFList;
