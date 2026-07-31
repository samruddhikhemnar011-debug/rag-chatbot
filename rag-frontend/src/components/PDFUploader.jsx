import React, { useState } from 'react';
import { FiUploadCloud, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadService } from '../services/uploadService';
import { useChat } from '../context/ChatContext';

const PDFUploader = () => {
  const { addDocument } = useChat();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        toast.success(`Selected ${droppedFile.name}`);
      } else {
        toast.error('Please upload a valid PDF file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadService.uploadPDF(file, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      toast.success(response?.message || 'PDF uploaded successfully!');
      if (addDocument) {
        addDocument({ name: response?.filename || file.name });
      }
      setFile(null);
    } catch (error) {

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to upload document.';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
            : 'border-gray-300 dark:border-dark-border hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {file ? file.name : "Drag and drop your PDF here"}
        </p>
        <p className="text-sm text-gray-400 mb-4">or click to browse</p>
        <input 
          type="file" 
          accept="application/pdf" 
          className="hidden" 
          id="file-upload"
          disabled={isUploading}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
              toast.success(`Selected ${e.target.files[0].name}`);
            }
          }}
        />
        <label 
          htmlFor="file-upload" 
          className={`btn-secondary cursor-pointer inline-block ${
            isUploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          Select File
        </label>
      </div>

      {file && (
        <div className="mt-4 flex flex-col gap-2">
          {isUploading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary-600 h-2 transition-all duration-200" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <div className="flex justify-end">
            <button 
              onClick={handleUpload} 
              disabled={isUploading} 
              className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <FiLoader className="animate-spin text-lg" />
                  <span>Uploading {uploadProgress > 0 ? `${uploadProgress}%` : '...'}</span>
                </>
              ) : (
                'Upload Document'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
