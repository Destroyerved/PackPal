
import React, { useState } from 'react';
import { useAppContext, Event, User, UserRole } from '@/context/AppContext';
import { Plus, UserPlus, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type MemberListProps = {
  event: Event;
  canEdit: boolean;
};

export const MemberList: React.FC<MemberListProps> = ({ event, canEdit }) => {
  const { updateMemberInEvent, removeMemberFromEvent, currentUser } = useAppContext();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('Member');
  
  // Handle role change
  const handleRoleChange = (userId: string, role: UserRole) => {
    updateMemberInEvent(event.id, userId, role);
  };
  
  // Handle member removal
  const handleRemoveMember = (userId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from this event?`)) {
      removeMemberFromEvent(event.id, userId);
    }
  };
  
  // Handle add member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberName.trim()) return;
    
    // Create a new user
    const newMember: User = {
      id: `user-${Date.now()}`,
      name: newMemberName.trim(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      role: newMemberRole,
    };
    
    // Add member to event
    updateMemberInEvent(event.id, newMember.id, newMemberRole);
    
    // Reset form and close modal
    setNewMemberName('');
    setNewMemberRole('Member');
    setIsAddMemberModalOpen(false);
  };
  
  // Get role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Owner':
      case 'Admin':
        return <ShieldCheck className="text-purple-500" size={18} />;
      case 'Member':
        return <ShieldAlert className="text-gray-400" size={18} />;
      case 'Viewer':
        return <ShieldAlert className="text-gray-300" size={18} />;
      default:
        return null;
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Team Members</h3>
          {canEdit && (
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setIsAddMemberModalOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span>Add Member</span>
            </Button>
          )}
        </div>
        
        <div className="divide-y">
          {event.members.map((member) => {
            const isCurrentUser = member.id === currentUser?.id;
            const isOwner = member.role === 'Owner';
            // Only allow removing non-owners and not yourself
            const canRemove = canEdit && !isOwner && !isCurrentUser;
            
            return (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.name} {isCurrentUser && <span className="text-sm text-gray-500">(You)</span>}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      {getRoleIcon(member.role)}
                      <span>{member.role}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {canEdit && !isCurrentUser && (
                    <select 
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                      className="rounded-md border border-gray-300 text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={isOwner} // Can't change the Owner's role
                    >
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  )}
                  
                  {canRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      className="h-8 w-8 p-0 flex items-center justify-center text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Add Member Modal */}
      <Dialog open={isAddMemberModalOpen} onOpenChange={(open) => !open && setIsAddMemberModalOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddMember} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Member Name*
              </label>
              <input
                id="name"
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter member name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role*
              </label>
              <select
                id="role"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
                <option value="Viewer">Viewer</option>
              </select>
              
              <div className="mt-2 text-sm text-gray-500">
                <p><span className="font-medium">Admin:</span> Can manage items, members, and settings</p>
                <p><span className="font-medium">Member:</span> Can add/edit items assigned to them</p>
                <p><span className="font-medium">Viewer:</span> Can only view information</p>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsAddMemberModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newMemberName.trim()}
              >
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
