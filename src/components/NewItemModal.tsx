
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAppContext, Category, User, ItemStatus } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type NewItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  categories: Category[];
  members: User[];
};

export const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  eventId,
  categories,
  members,
}) => {
  const { addItemToEvent, isDuplicateItem } = useAppContext();
  
  // Form state
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [assignedToUserId, setAssignedToUserId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [nameError, setNameError] = useState('');
  
  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setName('');
      setCategoryId(categories[0]?.id || '');
      setAssignedToUserId(null);
      setNotes('');
      setIsRequired(false);
      setNameError('');
    }
  }, [isOpen, categories]);
  
  // Check for duplicate when name changes
  useEffect(() => {
    if (name.trim() && isDuplicateItem(eventId, name)) {
      setNameError('An item with this name already exists');
    } else {
      setNameError('');
    }
  }, [name, eventId, isDuplicateItem]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) return;
    if (nameError) return;
    
    // Create new item
    const newItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      categoryId,
      assignedToUserId,
      status: 'To Pack' as ItemStatus,
      notes: notes.trim(),
      isRequired,
    };
    
    addItemToEvent(eventId, newItem);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Item Name*
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter item name"
              required
            />
            {nameError && (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <AlertTriangle size={14} />
                <span>{nameError}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category*
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="assigned" className="block text-sm font-medium text-gray-700">
              Assigned To
            </label>
            <select
              id="assigned"
              value={assignedToUserId || ''}
              onChange={(e) => setAssignedToUserId(e.target.value || null)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add any additional information"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="required"
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
              Mark as required
            </label>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !!nameError}
            >
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
