
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, Users, Search, PlusCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Dashboard: React.FC = () => {
  const { events, currentUser } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Events</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Link
            to="/app/create-event"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>New Event</span>
          </Link>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Link 
              to={`/app/events/${event.id}`}
              key={event.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <p className="text-gray-600 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Package size={16} />
                  <span>{event.items.length} items</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {event.members.slice(0, 4).map((member, idx) => (
                      <img
                        key={idx}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                    {event.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        +{event.members.length - 4}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{event.members.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-2 bg-purple-500"></div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Package className="text-purple-500" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? "No events match your search query. Try another search term."
              : "You don't have any events yet. Create your first event!"}
          </p>
          {!searchQuery && (
            <Link
              to="/app/create-event"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>Create Event</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
