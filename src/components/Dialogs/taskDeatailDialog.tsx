// components/dialogs/taskDetailDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task, Comment, Attachment, User } from '@/types/todos';
import { useTasks } from '@/hooks/useTasks';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  currentUser: User | null;
}

export const TaskDetailDialog = ({ open, onOpenChange, task, currentUser }: TaskDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { loadComments, addComment, deleteComment, loadAttachments, addAttachment, deleteAttachment } = useTasks(task?.type || 'business');

  useEffect(() => {
    if (open && task) {
      loadTaskData();
    }
  }, [open, task]);

  const loadTaskData = async () => {
    if (!task) return;
    
    setLoading(true);
    try {
      const [commentsData, attachmentsData] = await Promise.all([
        loadComments(task.id),
        loadAttachments(task.id)
      ]);
      setComments(commentsData);
      setAttachments(attachmentsData);
    } catch (error) {
      console.error('Error loading task data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim() || !currentUser) return;

    try {
      await addComment(task.id, newComment.trim());
      setNewComment('');
      await loadTaskData(); // Reload comments
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!task) return;
    
    try {
      await deleteComment(task.id, commentId);
      await loadTaskData(); // Reload comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!task || !e.target.files?.length || !currentUser) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      await addAttachment(task.id, file);
      await loadTaskData(); // Reload attachments
    } catch (error) {
      console.error('Error adding attachment:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!task) return;
    
    try {
      await deleteAttachment(task.id, attachmentId);
      await loadTaskData(); // Reload attachments
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.title}
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {task.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
            <TabsTrigger value="attachments">Attachments ({attachments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span>{task.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Assigned To:</span>
                    <span>{task.assignedToName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Department:</span>
                    <span>{task.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : ''}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Estimated Hours:</span>
                    <span>{task.estimatedHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Actual Hours:</span>
                    <span>{task.actualHours || 0}h</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Completion</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="w-full" />
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Tags</Label>
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Created:</span>
                    <span>{new Date(task.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Updated:</span>
                    <span>{new Date(task.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created By:</span>
                    <span>{task.createdByName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      Add
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex gap-3 p-3 border rounded-lg"
                        >
                          <Avatar>
                            <AvatarImage src={comment.userPhotoURL} />
                            <AvatarFallback>
                              {comment.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            {comment.userId === currentUser?.uid && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {comments.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                      Upload File
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-2">Uploading file...</p>}
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {attachments.map((attachment) => (
                        <motion.div
                          key={attachment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm">📎</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{attachment.fileName}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.fileSize)} • {new Date(attachment.uploadedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(attachment.fileUrl, '_blank')}
                            >
                              View
                            </Button>
                            {attachment.uploadedBy === currentUser?.uid && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteAttachment(attachment.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {attachments.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No attachments yet. Upload files to share with your team.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};