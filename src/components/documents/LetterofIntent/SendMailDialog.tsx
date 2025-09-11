"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmailDialogProps {
    open: boolean;
    onClose: () => void;
    onSend: (email: string) => Promise<void>;
}

export function EmailDialog({ open, onClose, onSend }: EmailDialogProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!email) return;
        setLoading(true);
        try {
            await onSend(email); // wait for handleEmailSend to finish
            setEmail("");
            
        } catch (err) {
            console.error("Email sending failed:", err);
        } finally {
            setLoading(false);
            onClose(); // only close after success
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send PDF via Email</DialogTitle>
                </DialogHeader>
                <Input
                    type="email"
                    placeholder="Enter recipient email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={loading || !email}>
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
