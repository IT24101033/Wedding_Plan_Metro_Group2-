
import React, { useState } from 'react';
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
import { Bell, Calendar, Home, Mail, Search, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(3);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">WeddingMatch</Link>
            <nav className="hidden md:flex items-center space-x-4 ml-8">
              <Link 
                to="/user" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/user') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Home className="h-4 w-4 mr-2 inline-block" />
                Home
              </Link>
              <Link 
                to="/user/vendors" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/user/vendors') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Search className="h-4 w-4 mr-2 inline-block" />
                Find Vendors
              </Link>
              <Link 
                to="/user/bookings" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/user/bookings') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2 inline-block" />
                My Bookings
              </Link>
              <Link 
                to="/user/messages" 
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/user/messages') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Mail className="h-4 w-4 mr-2 inline-block" />
                Messages
                {unreadMessages > 0 && (
                  <Badge className="ml-1 bg-primary text-xs">{unreadMessages}</Badge>
                )}
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/user/messages">
                <Bell className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={currentUser?.name || 'User'} />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name || 'Demo Client'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.email || 'client@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/user')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user/bookings')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Bookings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/user/messages')}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Messages</span>
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
            &copy; {new Date().getFullYear()} WeddingMatch. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/user/help-center" className="hover:underline">Help Center</Link>
            <Link to="/user/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/user/contact-us" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
