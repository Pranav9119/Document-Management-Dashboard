import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { downloadDocument } from '../services/api';

const DocumentTable = ({ documents, isLoading, error }) => {
  const handleDownload = async (doc) => {
    try {
      const response = await downloadDocument(doc._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download document');
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
        <p>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 flex flex-col items-center justify-center text-red-500 bg-red-50 border-red-100">
        <AlertCircle size={32} className="mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-gray-500 border-dashed border-2 bg-gray-50/50">
        <FileText size={48} className="text-gray-300 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-1">No documents yet</p>
        <p className="text-sm">Upload some PDFs to get started.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-xs font-semibold tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4">Document Name</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Uploaded</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.map((doc) => (
              <tr key={doc._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <FileText size={18} />
                    </div>
                    <span className="font-medium text-gray-900 truncate max-w-xs">
                      {doc.originalName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatSize(doc.size)}
                </td>
                <td className="px-6 py-4">
                  <span className={`badge badge-${doc.status}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {format(new Date(doc.uploadedAt), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="btn-ghost ml-auto group/btn"
                    disabled={doc.status !== 'complete'}
                    title={doc.status !== 'complete' ? 'Still processing' : 'Download'}
                  >
                    <Download size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;
