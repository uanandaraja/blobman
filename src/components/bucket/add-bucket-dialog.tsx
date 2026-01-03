"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddBucketForm } from "./add-bucket-form";

interface AddBucketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBucketDialog({ open, onOpenChange }: AddBucketDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bucket</DialogTitle>
          <DialogDescription>
            Connect an S3-compatible storage bucket.
          </DialogDescription>
        </DialogHeader>
        <AddBucketForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
