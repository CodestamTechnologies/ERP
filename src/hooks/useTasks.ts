// hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import { Task, TaskType, Comment, Attachment, User } from '@/types/todos';
import { useAuth } from '@/context/authContext';
import { 
  getTasksByType, 
  getTaskById, 
  addTask, 
  updateTask, 
  deleteTask, 
  updateTaskProgress,
  getCommentsByTaskId,
  addComment,
  updateComment,
  deleteComment,
  getAttachmentsByTaskId,
  addAttachment,
  deleteAttachment,
  uploadTaskAttachment,
  getUsers,
  getUserById
} from '@/lib/firebase/database/todos';

export const useTasks = (type: TaskType) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }, []);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const tasksData = await getTasksByType(type);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  // Get a single task
  const getTask = async (taskId: string): Promise<Task | null> => {
    try {
      return await getTaskById(taskId);
    } catch (err) {
      setError('Failed to load task');
      console.error(err);
      throw err;
    }
  };

  // Add a new task
  const addNewTask = async (taskData: Omit<Task, 'id'>): Promise<string> => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      // Get assigned user details
      let assignedToName = '';
      if (taskData.assignedTo) {
        const assignedUser = await getUserById(taskData.assignedTo);
        assignedToName = assignedUser?.displayName || '';
      }

      const taskId = await addTask({
        ...taskData,
        assignedToName
      }, currentUser);
      
      await loadTasks(); // Reload tasks to include the new one
      return taskId;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    }
  };

  // Update a task
  const updateExistingTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // If assignedTo is being updated, get the user's name
      if (updates.assignedTo) {
        const assignedUser = await getUserById(updates.assignedTo);
        updates.assignedToName = assignedUser?.displayName || '';
      }

      await updateTask(taskId, updates);
      // Update local state immediately for better UX
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    }
  };

  // Delete a task
  const deleteExistingTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      // Update local state immediately for better UX
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    }
  };

  // Update task progress
  const updateTaskProgressStatus = async (taskId: string, progress: number) => {
    try {
      const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending';
      
      await updateTaskProgress(taskId, progress);
      // Update local state immediately for better UX
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, progress, status } : task
      ));
    } catch (err) {
      setError('Failed to update task progress');
      console.error(err);
      throw err;
    }
  };

  // Comments operations
  const loadComments = async (taskId: string): Promise<Comment[]> => {
    try {
      return await getCommentsByTaskId(taskId);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
      throw err;
    }
  };

  const addNewComment = async (taskId: string, content: string): Promise<string> => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      const commentData: Omit<Comment, 'id'> = {
        content,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return await addComment(taskId, commentData, currentUser);
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
      throw err;
    }
  };

  const updateExistingComment = async (taskId: string, commentId: string, content: string): Promise<void> => {
    try {
      await updateComment(taskId, commentId, content);
    } catch (err) {
      setError('Failed to update comment');
      console.error(err);
      throw err;
    }
  };

  const deleteExistingComment = async (taskId: string, commentId: string): Promise<void> => {
    try {
      await deleteComment(taskId, commentId);
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
      throw err;
    }
  };

  // Attachments operations
  const loadAttachments = async (taskId: string): Promise<Attachment[]> => {
    try {
      return await getAttachmentsByTaskId(taskId);
    } catch (err) {
      setError('Failed to load attachments');
      console.error(err);
      throw err;
    }
  };

  const addNewAttachment = async (taskId: string, file: File): Promise<string> => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      // Upload file to storage
      const fileUrl = await uploadTaskAttachment(file);

      const attachmentData: Omit<Attachment, 'id'> = {
        fileName: file.name,
        fileUrl,
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: currentUser.uid,
        uploadedByName: currentUser.displayName,
        uploadedByPhotoURL: currentUser.photoURL,
        uploadedAt: new Date().toISOString()
      };

      return await addAttachment(taskId, attachmentData, currentUser);
    } catch (err) {
      setError('Failed to add attachment');
      console.error(err);
      throw err;
    }
  };

  const deleteExistingAttachment = async (taskId: string, attachmentId: string): Promise<void> => {
    try {
      await deleteAttachment(taskId, attachmentId);
    } catch (err) {
      setError('Failed to delete attachment');
      console.error(err);
      throw err;
    }
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    try {
      return await uploadTaskAttachment(file);
    } catch (err) {
      setError('Failed to upload file');
      console.error(err);
      throw err;
    }
  };

  // Load tasks and users on mount and when type changes
  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [loadTasks, loadUsers]);

  return {
    tasks,
    users,
    loading,
    error,
    getTask,
    addTask: addNewTask,
    updateTask: updateExistingTask,
    deleteTask: deleteExistingTask,
    updateTaskProgress: updateTaskProgressStatus,
    loadComments,
    addComment: addNewComment,
    updateComment: updateExistingComment,
    deleteComment: deleteExistingComment,
    loadAttachments,
    addAttachment: addNewAttachment,
    deleteAttachment: deleteExistingAttachment,
    uploadFile: uploadFileToStorage,
    refreshTasks: loadTasks,
    refreshUsers: loadUsers
  };
};