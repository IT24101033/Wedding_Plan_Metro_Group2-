
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Calendar, User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">WeddingMatch</Link>
            <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-0.5 rounded">Admin</span>
            <nav className="hidden md:flex items-center space-x-4 ml-8">
              <Link 
                to="/admin/dashboard" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/admin/dashboard') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Home className="h-4 w-4 mr-2 inline-block" />
                Dashboard
              </Link>
              <Link 
                to="/admin/vendors" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/admin/vendors') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <User className="h-4 w-4 mr-2 inline-block" />
                Vendors
              </Link>
              <Link 
                to="/admin/bookings" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/admin/bookings') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2 inline-block" />
                Bookings
              </Link>
              <Link 
                to="/admin/settings" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/admin/settings') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Settings className="h-4 w-4 mr-2 inline-block" />
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={currentUser?.name || 'Admin'} />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name || 'System Administrator'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.email || 'admin@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-16 items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WeddingMatch Admin Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
