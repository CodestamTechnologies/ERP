"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmailDialogProps {
    open: boolean;
    onClose: () => void;
    onSend: (email: string) => void;
}

export function EmailDialog({ open, onClose, onSend }: EmailDialogProps) {
    const [email, setEmail] = useState("");

    const handleSend = () => {
        if (!email) return;
        onSend(email);
        setEmail("");
        onClose();
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
                />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend}>Send</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
