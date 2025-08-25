// lib/firebase/database/todos.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  getDoc,
  DocumentData 
} from 'firebase/firestore';
import { firestore } from '../firebase-main';
import { Task, TaskType, Comment, Attachment, User } from '@/types/todos';
import { uploadFile } from '@/lib/utils';

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const q = query(collection(firestore, 'users'), orderBy('displayName', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        role: data.role || 'user',
        department: data.department || '',
        createdAt: data.createdAt || new Date().toISOString(),
        lastLoginAt: data.lastLoginAt || ''
      } as User;
    });
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || '',
        role: data.role || 'user',
        department: data.department || '',
        createdAt: data.createdAt || new Date().toISOString(),
        lastLoginAt: data.lastLoginAt || ''
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Get all tasks by type
export const getTasksByType = async (type: TaskType): Promise<Task[]> => {
  try {
    const q = query(
      collection(firestore, 'tasks'),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const docRef = doc(firestore, 'tasks', taskId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Task;
    }
    return null;
  } catch (error) {
    console.error('Error getting task:', error);
    throw error;
  }
};

// Add a new task
export const addTask = async (taskData: Omit<Task, 'id'>, currentUser: User): Promise<string> => {
  try {
    const docRef = await addDoc(collection(firestore, 'tasks'), {
      ...taskData,
      createdBy: currentUser.uid,
      createdByName: currentUser.displayName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  try {
    await updateDoc(doc(firestore, 'tasks', taskId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, 'tasks', taskId));
    // Also delete associated comments and attachments
    await deleteCommentsByTaskId(taskId);
    await deleteAttachmentsByTaskId(taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Update task progress
export const updateTaskProgress = async (taskId: string, progress: number): Promise<void> => {
  try {
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending';
    
    await updateDoc(doc(firestore, 'tasks', taskId), {
      progress,
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating task progress:', error);
    throw error;
  }
};

// Comments operations (nested in tasks collection)
export const getCommentsByTaskId = async (taskId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(firestore, 'tasks', taskId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const addComment = async (taskId: string, commentData: Omit<Comment, 'id'>, currentUser: User): Promise<string> => {
  try {
    const docRef = await addDoc(collection(firestore, 'tasks', taskId, 'comments'), {
      ...commentData,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userPhotoURL: currentUser.photoURL,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const updateComment = async (taskId: string, commentId: string, content: string): Promise<void> => {
  try {
    await updateDoc(doc(firestore, 'tasks', taskId, 'comments', commentId), {
      content,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (taskId: string, commentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, 'tasks', taskId, 'comments', commentId));
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const deleteCommentsByTaskId = async (taskId: string): Promise<void> => {
  try {
    const comments = await getCommentsByTaskId(taskId);
    const deletePromises = comments.map(comment => deleteComment(taskId, comment.id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting comments:', error);
    throw error;
  }
};

// Attachments operations (nested in tasks collection)
export const getAttachmentsByTaskId = async (taskId: string): Promise<Attachment[]> => {
  try {
    const q = query(
      collection(firestore, 'tasks', taskId, 'attachments'),
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Attachment));
  } catch (error) {
    console.error('Error getting attachments:', error);
    throw error;
  }
};

export const addAttachment = async (taskId: string, attachmentData: Omit<Attachment, 'id'>, currentUser: User): Promise<string> => {
  try {
    const docRef = await addDoc(collection(firestore, 'tasks', taskId, 'attachments'), {
      ...attachmentData,
      uploadedBy: currentUser.uid,
      uploadedByName: currentUser.displayName,
      uploadedByPhotoURL: currentUser.photoURL,
      uploadedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding attachment:', error);
    throw error;
  }
};

export const deleteAttachment = async (taskId: string, attachmentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, 'tasks', taskId, 'attachments', attachmentId));
  } catch (error) {
    console.error('Error deleting attachment:', error);
    throw error;
  }
};

export const deleteAttachmentsByTaskId = async (taskId: string): Promise<void> => {
  try {
    const attachments = await getAttachmentsByTaskId(taskId);
    const deletePromises = attachments.map(attachment => deleteAttachment(taskId, attachment.id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting attachments:', error);
    throw error;
  }
};

// Upload file to storage
export const uploadTaskAttachment = async (file: File): Promise<string> => {
  try {
    return await uploadFile(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};