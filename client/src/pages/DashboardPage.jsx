import { useEffect, useState, useCallback } from 'react';
import { getDocuments } from '../services/api';
import DocumentTable from '../components/DocumentTable';
import { useNotifications } from '../context/NotificationContext';
import { RefreshCw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refetch when socket sends new notification (e.g. bulk upload finished)
  const { notifications } = useNotifications();

  const fetchDocs = useCallback(async () => {
  try {
    console.log('Fetching documents...');
    setIsLoading(true);
    setError(null);
    const { data } = await getDocuments();
    console.log('Fetched documents response:', data);
    setDocuments(data);
  } catch (err) {
    console.error('Failed to fetch documents:', err);
    setError('Could not load documents. Please try again.');
  } finally {
    setIsLoading(false);
  }
}, []);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs, notifications.length]); // refetch if notifications change

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and download your uploaded documents.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDocs}
            disabled={isLoading}
            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <Link to="/upload" className="btn-primary">
            <Plus size={18} /> Upload New
          </Link>
        </div>
      </div>

      <DocumentTable 
        documents={documents} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default DashboardPage;
