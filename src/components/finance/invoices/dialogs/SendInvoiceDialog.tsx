'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Invoice } from '@/hooks/useInvoices';
import { Mail, Send, FileText, User } from 'lucide-react';
import { useState } from 'react';
interface EmailData {
  to: string;
  cc: string;
  subject: string;
  message: string;
  sendCopy: boolean;
  attachPdf: boolean;
}
interface SendInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSend: (invoiceId: string, emailData: EmailData) => void;
  isProcessing: boolean;
}

export const SendInvoiceDialog = ({
  isOpen,
  onClose,
  invoice,
  onSend,
  isProcessing
}: SendInvoiceDialogProps) => {
  const [toEmail, setToEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendCopy, setSendCopy] = useState(true);
  const [attachPdf, setAttachPdf] = useState(true);

  if (!invoice) return null;

  const defaultSubject = `Invoice ${invoice.invoiceNumber} from Your Company`;
  const defaultMessage = `Dear ${invoice.customerName},

Please find attached invoice ${invoice.invoiceNumber} for the amount of $${invoice.totalAmount.toLocaleString()}.

Payment is due by ${new Date(invoice.dueDate).toLocaleDateString()}.

Thank you for your business!

Best regards,
Your Company`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailData = {
      to: toEmail || invoice.customerEmail,
      cc: ccEmail,
      subject: subject || defaultSubject,
      message: message || defaultMessage,
      sendCopy,
      attachPdf
    };

    onSend(invoice.id, emailData);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setToEmail('');
    setCcEmail('');
    setSubject('');
    setMessage('');
    setSendCopy(true);
    setAttachPdf(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send size={24} className="text-blue-600" />
            Send Invoice
          </DialogTitle>
          <DialogDescription>
            Send invoice {invoice.invoiceNumber} to customer
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">{invoice.invoiceNumber}</h4>
                  <p className="text-sm text-blue-700">{invoice.customerName} • ${invoice.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="toEmail">To Email</Label>
              <Input
                id="toEmail"
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder={invoice.customerEmail}
              />
              <p className="text-xs text-gray-500">Leave blank to use customer&apos;s email: {invoice.customerEmail}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ccEmail">CC Email (Optional)</Label>
              <Input
                id="ccEmail"
                type="email"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                placeholder="additional@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={defaultSubject}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={defaultMessage}
                rows={8}
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachPdf"
                checked={attachPdf}
                onCheckedChange={(checked) => setAttachPdf(!!checked)}
              />
              <Label htmlFor="attachPdf">Attach PDF invoice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendCopy"
                checked={sendCopy}
                onCheckedChange={(checked) => setSendCopy(!!checked)}
              />
              <Label htmlFor="sendCopy">Send a copy to me</Label>
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Email Preview</h4>
              <div className="text-sm space-y-1">
                <p><strong>To:</strong> {toEmail || invoice.customerEmail}</p>
                {ccEmail && <p><strong>CC:</strong> {ccEmail}</p>}
                <p><strong>Subject:</strong> {subject || defaultSubject}</p>
                <div className="mt-2 p-2 bg-white rounded border">
                  <p className="whitespace-pre-wrap text-xs">{message || defaultMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>Sending...</>
              ) : (
                <>
                  <Mail size={16} className="mr-2" />
                  Send Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};