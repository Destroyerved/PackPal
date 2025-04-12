
import React, { useState } from 'react';
import { useAppContext, Item, Event, ItemStatus } from '@/context/AppContext';
import { AlertTriangle, Check, Clock, Trash2, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ItemCardProps = {
  item: Item;
  event: Event;
  canEdit: boolean;
};

export const ItemCard: React.FC<ItemCardProps> = ({ item, event, canEdit }) => {
  const { updateItemInEvent, deleteItemFromEvent } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });
  
  // Find the category for this item
  const category = event.categories.find(c => c.id === item.categoryId);
  
  // Find the assigned user for this item
  const assignedUser = item.assignedToUserId 
    ? event.members.find(m => m.id === item.assignedToUserId) 
    : null;
  
  // Get the status background color
  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case 'To Pack':
        return 'bg-status-toPack';
      case 'Packed':
        return 'bg-status-packed';
      case 'Delivered':
        return 'bg-status-delivered';
      default:
        return 'bg-gray-100';
    }
  };
  
  // Get status icon
  const StatusIcon = () => {
    switch (item.status) {
      case 'To Pack':
        return <Clock size={16} className="text-amber-600" />;
      case 'Packed':
        return <Check size={16} className="text-green-600" />;
      case 'Delivered':
        return <Check size={16} className="text-blue-600" />;
      default:
        return null;
    }
  };
  
  // Handle item status update
  const handleStatusUpdate = (status: ItemStatus) => {
    if (!canEdit) return;
    updateItemInEvent(event.id, item.id, { status });
  };
  
  // Handle item delete
  const handleDelete = () => {
    if (!canEdit) return;
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItemFromEvent(event.id, item.id);
    }
  };
  
  // Handle item edit
  const handleEditSave = () => {
    if (isEditing) {
      updateItemInEvent(event.id, item.id, editedItem);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  
  return (
    <div className={`rounded-lg border border-gray-200 overflow-hidden ${getStatusColor(item.status)}`}>
      <div className="p-4 space-y-3">
        {/* Item header */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            {isEditing ? (
              <input
                type="text"
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                className="font-medium text-gray-900 rounded border border-gray-300 px-2 py-1"
              />
            ) : (
              <h4 className="font-medium text-gray-900">{item.name}</h4>
            )}
            {item.isRequired && (
              <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                Required
              </span>
            )}
          </div>
          
          {/* Assigned user */}
          {assignedUser && (
            <div className="flex items-center">
              <img 
                src={assignedUser.avatar}
                alt={assignedUser.name}
                className="w-7 h-7 rounded-full"
              />
            </div>
          )}
        </div>
        
        {/* Notes */}
        {(isEditing || item.notes) && (
          <div>
            {isEditing ? (
              <textarea
                value={editedItem.notes}
                onChange={(e) => setEditedItem({ ...editedItem, notes: e.target.value })}
                className="w-full text-sm text-gray-600 rounded border border-gray-300 px-2 py-1"
                rows={2}
                placeholder="Add notes..."
              />
            ) : (
              <p className="text-sm text-gray-600">{item.notes}</p>
            )}
          </div>
        )}
        
        {/* Category */}
        {category && (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: category.color }}
            ></div>
            <span className="text-xs text-gray-500">{category.name}</span>
          </div>
        )}
        
        {/* Controls */}
        <div className="pt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <StatusIcon />
            <span className="text-sm">{item.status}</span>
          </div>
          
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditSave}
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                {isEditing ? <Save size={16} /> : <Edit size={16} />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 flex items-center justify-center text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        </div>
        
        {/* Status controls */}
        {canEdit && (
          <div className="pt-2 flex items-center justify-between border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusUpdate('To Pack')}
              className={`text-xs ${item.status === 'To Pack' ? 'bg-status-toPack' : ''}`}
            >
              To Pack
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusUpdate('Packed')}
              className={`text-xs ${item.status === 'Packed' ? 'bg-status-packed' : ''}`}
            >
              Packed
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStatusUpdate('Delivered')}
              className={`text-xs ${item.status === 'Delivered' ? 'bg-status-delivered' : ''}`}
            >
              Delivered
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
