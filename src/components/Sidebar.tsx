
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  List, 
  PlusCircle, 
  Calendar, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC = () => {
  const { currentUser, events } = useAppContext();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-light text-blue-dark"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar content */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          isMobile ? "fixed inset-y-0 left-0 z-40" : "relative",
          isOpen ? "w-64" : isMobile ? "w-0" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-center border-b border-sidebar-border">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <Package className="text-sidebar-primary" />
              <span className="font-bold text-xl text-sidebar-primary">PackPal</span>
            </div>
          ) : (
            <Package className="text-sidebar-primary" />
          )}
        </div>

        {/* User info */}
        {currentUser && (
          <div className={cn("p-4 flex items-center gap-3 border-b border-sidebar-border", !isOpen && "justify-center")}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full"
            />
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
                <p className="text-sm text-sidebar-foreground/70 truncate">{currentUser.role}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          <Link
            to="/app"
            className={cn(
              "flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent transition-colors",
              location.pathname === "/app" && "bg-sidebar-accent text-sidebar-accent-foreground",
              !isOpen && "justify-center"
            )}
          >
            <List size={20} />
            {isOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/app/create-event"
            className={cn(
              "flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent transition-colors",
              location.pathname === "/app/create-event" && "bg-sidebar-accent text-sidebar-accent-foreground",
              !isOpen && "justify-center"
            )}
          >
            <PlusCircle size={20} />
            {isOpen && <span>New Event</span>}
          </Link>
          
          {/* Events list */}
          {isOpen && events.length > 0 && (
            <div className="pt-4">
              <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Your Events
              </h3>
              <div className="mt-2 space-y-1">
                {events.slice(0, 5).map((event) => (
                  <Link
                    key={event.id}
                    to={`/app/events/${event.id}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md hover:bg-sidebar-accent transition-colors",
                      location.pathname === `/app/events/${event.id}` && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <Calendar size={18} />
                    <span className="truncate">{event.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Logout button */}
        <div className={cn("p-4 border-t border-sidebar-border", !isOpen && "flex justify-center")}>
          <button className="flex items-center gap-3 text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors">
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Desktop toggle button */}
        {!isMobile && (
          <div className="p-2 border-t border-sidebar-border flex justify-end">
            <button
              onClick={toggle}
              className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
