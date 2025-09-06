// types/todos.ts
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold';
export type TaskType = 'business' | 'personal';
export type UserRole = 'admin' | 'user' | 'manager';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string; // User UID
  assignedToName: string; // User display name
  department: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  progress: number;
  estimatedHours: number;
  actualHours?: number;
  type: TaskType;
  createdBy: string; // User UID
  createdByName: string; // User display name
}

export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  dueDate: string;
  estimatedHours: number;
  tags?: string;
  assignedTo?: string;
  department?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByPhotoURL?: string;
  uploadedAt: string;
}