import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Toast from './components/Toast';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        <Header />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>

        {/* Global Toast for Notifications */}
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;
