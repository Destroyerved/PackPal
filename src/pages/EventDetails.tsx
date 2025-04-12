
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Calendar, MapPin, Package, Plus, Trash2, Users, Filter, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemCard } from '@/components/ItemCard';
import { NewItemModal } from '@/components/NewItemModal';
import { MemberList } from '@/components/MemberList';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, deleteEvent, currentUser } = useAppContext();
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Find the current event
  const event = events.find((e) => e.id === eventId);
  
  // Current user's role in this event
  const userRole = event?.members.find(m => m.id === currentUser?.id)?.role;
  
  // Handle delete event
  const handleDelete = () => {
    if (!event) return;
    
    if (window.confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
      deleteEvent(event.id);
      navigate('/app');
    }
  };
  
  if (!event) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Event not found</p>
      </div>
    );
  }

  // Filter items based on selected category and status
  const filteredItems = event.items.filter(item => {
    if (selectedCategory && item.categoryId !== selectedCategory) return false;
    if (selectedStatus && item.status !== selectedStatus) return false;
    return true;
  });

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = event.categories.find(c => c.id === item.categoryId);
    if (!category) return acc;
    
    if (!acc[category.id]) {
      acc[category.id] = {
        category,
        items: []
      };
    }
    
    acc[category.id].items.push(item);
    return acc;
  }, {} as Record<string, { category: typeof event.categories[0], items: typeof event.items }>);

  // Calculate completion stats
  const totalItems = event.items.length;
  const packedItems = event.items.filter(item => item.status === "Packed" || item.status === "Delivered").length;
  const deliveredItems = event.items.filter(item => item.status === "Delivered").length;
  
  const packedPercentage = totalItems ? Math.round((packedItems / totalItems) * 100) : 0;
  const deliveredPercentage = totalItems ? Math.round((deliveredItems / totalItems) * 100) : 0;

  const hasPermissionToEdit = userRole === 'Owner' || userRole === 'Admin';

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-gray-600">{event.description}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Package size={18} />
                <span>{event.items.length} items</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={18} />
                <span>{event.members.length} members</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {hasPermissionToEdit && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span>Delete Event</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-3">Packing Progress</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-purple-600">
                  {packedPercentage}% Packed
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block">
                  {packedItems}/{totalItems} items
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div 
                style={{ width: `${packedPercentage}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-3">Delivery Progress</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-purple-600">
                  {deliveredPercentage}% Delivered
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block">
                  {deliveredItems}/{totalItems} items
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div 
                style={{ width: `${deliveredPercentage}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for Items and Members */}
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package size={16} />
            <span>Items</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users size={16} />
            <span>Members</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Filter size={18} className="text-gray-500" />
              
              {/* Category filter */}
              <select 
                value={selectedCategory || ''} 
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="rounded-md border border-gray-300 text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {event.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              {/* Status filter */}
              <select 
                value={selectedStatus || ''} 
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                className="rounded-md border border-gray-300 text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Statuses</option>
                <option value="To Pack">To Pack</option>
                <option value="Packed">Packed</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            
            {hasPermissionToEdit && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsNewItemModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </Button>
            )}
          </div>
          
          {/* Items list */}
          {Object.values(itemsByCategory).length > 0 ? (
            Object.values(itemsByCategory).map(({ category, items }) => (
              <div key={category.id} className="space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span>{category.name}</span>
                  <span className="text-gray-500 text-sm ml-2">({items.length} items)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      event={event}
                      canEdit={hasPermissionToEdit || item.assignedToUserId === currentUser?.id}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Package className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-gray-600 mb-6">
                {event.items.length > 0 
                  ? "No items match the selected filters. Try changing your filters."
                  : "This event doesn't have any items yet."}
              </p>
              {hasPermissionToEdit && event.items.length === 0 && (
                <Button 
                  onClick={() => setIsNewItemModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>Add First Item</span>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="members">
          <MemberList 
            event={event} 
            canEdit={hasPermissionToEdit} 
          />
        </TabsContent>
      </Tabs>
      
      {/* New Item Modal */}
      <NewItemModal 
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        eventId={event.id}
        categories={event.categories}
        members={event.members}
      />
    </div>
  );
};

export default EventDetails;
