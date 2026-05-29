import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, X, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { uploadFile, notifyBulkComplete } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  // Handle file selection
  const handleFiles = useCallback((selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(f => f.type === 'application/pdf');
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were ignored. Only PDF files are allowed.');
    }

    const newFiles = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
      status: 'pending', // pending, uploading, complete, failed
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'failed');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    const isBulk = pendingFiles.length > 3;

    if (isBulk) {
      showToast(`Upload in progress — processing ${pendingFiles.length} files in background.`, 'info');
    }

    let successCount = 0;

    // Process sequentially (or you could do Promise.all for parallel, but sequential is safer for many files)
    for (const item of pendingFiles) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f));
      
      const formData = new FormData();
      formData.append('file', item.file);

      try {
        await uploadFile(formData, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFiles(prev => prev.map(f => 
            f.id === item.id ? { ...f, progress: percentCompleted } : f
          ));
        });
        
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'complete', progress: 100 } : f));
        successCount++;
      } catch (err) {
        console.error(`Failed to upload ${item.name}:`, err);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'failed', progress: 0 } : f));
      }
    }

    setIsUploading(false);

    if (isBulk && successCount > 0) {
      // Trigger backend to emit real-time socket notification
      try {
        await notifyBulkComplete(successCount);
      } catch(err) {
        console.error("Bulk notify failed", err);
      }
    } else if (!isBulk && successCount === pendingFiles.length) {
      // Normal flow - all succeeded, just go back
      setTimeout(() => navigate('/'), 1000);
    }
  };

  const formatSize = (bytes) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      <div className="mb-6 flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Select one or multiple PDF files to upload to your dashboard.</p>
        </div>
      </div>

      {/* Dropzone */}
      <div 
        className={`card p-10 mb-8 border-2 border-dashed transition-all duration-200 text-center cursor-pointer flex flex-col items-center justify-center
          ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/50'}
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          accept="application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.length > 0) handleFiles(e.target.files);
            e.target.value = null; // reset input
          }}
        />
        
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 shadow-sm">
          <Upload size={28} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Click or drag files here</h3>
        <p className="text-gray-500 text-sm mb-4">Only PDF files are supported (Max 50MB per file)</p>
        
        <button className="btn-primary pointer-events-none">
          Browse Files
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              Selected Files <span className="badge bg-blue-100 text-blue-700">{files.length}</span>
            </h3>
            
            <button 
              onClick={handleUpload}
              disabled={isUploading || !files.some(f => f.status === 'pending' || f.status === 'failed')}
              className="btn-primary py-1.5 px-4 text-sm"
            >
              {isUploading ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={16} /> Start Upload</>
              )}
            </button>
          </div>
          
          <ul className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {files.map(item => (
              <li key={item.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <File size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate pr-4">{item.name}</p>
                      <button 
                        onClick={() => removeFile(item.id)}
                        disabled={isUploading && item.status === 'uploading'}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-30"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span>{formatSize(item.size)}</span>
                      <span>•</span>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                      
                      {item.status === 'complete' && <CheckCircle2 size={14} className="text-green-500 ml-auto" />}
                      {item.status === 'failed' && <AlertCircle size={14} className="text-red-500 ml-auto" />}
                    </div>

                    {/* Progress Bar */}
                    {(item.status === 'uploading' || item.progress > 0) && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full progress-bar rounded-full ${item.status === 'failed' ? 'bg-red-500' : item.status === 'complete' ? 'bg-green-500' : 'bg-blue-600'}`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default UploadPage;
