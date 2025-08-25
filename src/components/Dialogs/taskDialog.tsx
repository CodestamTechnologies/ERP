// components/dialogs/taskDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskFormData, TaskPriority, TaskType, User } from '@/types/todos';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (taskData: TaskFormData, taskId?: string) => void;
  type: TaskType;
  task?: Task | null;
  users: User[];
  currentUser: User | null;
  isLoading?: boolean;
}

const defaultTaskData: TaskFormData = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  dueDate: new Date().toISOString().split('T')[0],
  estimatedHours: 1,
  tags: '',
};

export const TaskDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  type, 
  task, 
  users, 
  currentUser, 
  isLoading = false 
}: TaskDialogProps) => {
  const [formData, setFormData] = useState<TaskFormData>(defaultTaskData);

  useEffect(() => {
    console.log('Users in TaskDialog:', users);
    console.log('Current user:', currentUser);
    console.log('Form department:', formData.department);
  }, [users, currentUser, formData.department]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        tags: task.tags.join(', '),
        assignedTo: task.assignedTo,
        department: task.department,
      });
    } else {
      setFormData(defaultTaskData);
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, task?.id);
    onOpenChange(false);
  };

  const handleChange = (field: keyof TaskFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categories = type === 'business' 
    ? ['Finance', 'Marketing', 'Human Resources', 'Technology', 'Operations', 'Sales', 'Security', 'Customer Experience']
    : ['Learning', 'Career', 'Personal', 'Health', 'Finance', 'Skills', 'Projects'];

  const departments = type === 'business'
    ? ['Finance', 'Marketing', 'Human Resources', 'IT', 'Operations', 'Sales', 'Security', 'Customer Success']
    : ['Personal Development'];

  // Filter users by department if needed, with fallback
  const filteredUsers = type === 'business' && formData.department
    ? users.filter(user => user.department === formData.department)
    : users;

  const availableUsers = filteredUsers.length > 0 ? filteredUsers : users;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : `Add ${type === 'business' ? 'Business' : 'Personal'} Task`}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the task details below.' : `Create a new ${type === 'business' ? 'business' : 'personal'} task.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="pr-2 -mr-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your task..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours *</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="1"
                value={formData.estimatedHours}
                onChange={(e) => handleChange('estimatedHours', parseInt(e.target.value))}
                required
              />
            </div>
            
            {type === 'business' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department || ''}
                    onValueChange={(value) => handleChange('department', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To *</Label>
                  <Select
                    value={formData.assignedTo || ''}
                    onValueChange={(value) => handleChange('assignedTo', value)}
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Loading users..." : "Select user"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="" disabled>
                          Loading users...
                        </SelectItem>
                      ) : (
                        availableUsers.map(user => (
                          <SelectItem key={user.uid} value={user.uid}>
                            {user.displayName} ({user.email})
                          </SelectItem>
                        ))
                      )}
                      {!isLoading && availableUsers.length === 0 && (
                        <SelectItem value="" disabled>
                          No users available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags || ''}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="learning, development, skills"
              />
            </div>
            
            <DialogFooter className="md:col-span-2 mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};