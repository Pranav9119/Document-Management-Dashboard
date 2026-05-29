import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/upload', label: 'Upload', icon: <UploadCloud size={18} /> },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
                <UploadCloud className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                DocManager
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
