
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  assignedTo?: string;
  status: 'toPack' | 'packed' | 'delivered';
  notes?: string;
  quantity: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: string;
  categories: Category[];
  items: Item[];
  members: User[];
}

interface AppContextProps {
  currentUser: User;
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
}

// Create context
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Sample data
const sampleUser: User = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  role: 'owner',
};

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Team Hackathon',
    description: 'Annual hackathon event',
    date: '2023-12-15',
    location: 'San Francisco, CA',
    createdBy: '1',
    categories: [
      { id: '1', name: 'Tech', color: '#0EA5E9' },
      { id: '2', name: 'Food', color: '#10B981' },
      { id: '3', name: 'Personal', color: '#8B5CF6' },
    ],
    items: [
      { id: '1', name: 'Laptop', categoryId: '1', assignedTo: '1', status: 'packed', quantity: 1 },
      { id: '2', name: 'Chargers', categoryId: '1', assignedTo: '2', status: 'toPack', quantity: 2 },
      { id: '3', name: 'Snacks', categoryId: '2', status: 'delivered', quantity: 5 },
    ],
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', role: 'owner' },
      { id: '2', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', role: 'admin' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', role: 'member' },
    ],
  },
  {
    id: '2',
    title: 'Beach Trip',
    description: 'Weekend getaway',
    date: '2023-07-22',
    location: 'Malibu, CA',
    createdBy: '1',
    categories: [
      { id: '1', name: 'Essentials', color: '#EF4444' },
      { id: '2', name: 'Drinks', color: '#3B82F6' },
    ],
    items: [
      { id: '1', name: 'Sunscreen', categoryId: '1', assignedTo: '1', status: 'packed', quantity: 1 },
      { id: '2', name: 'Beach Towels', categoryId: '1', assignedTo: '3', status: 'toPack', quantity: 4 },
      { id: '3', name: 'Water Bottles', categoryId: '2', status: 'delivered', quantity: 6 },
    ],
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', role: 'owner' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', role: 'member' },
      { id: '4', name: 'Sarah Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'viewer' },
    ],
  },
];

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser: sampleUser,
        events,
        addEvent,
        updateEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for consuming context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
