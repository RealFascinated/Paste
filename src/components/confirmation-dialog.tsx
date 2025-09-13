"use client";

import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface ConfirmationDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Specific confirmation dialogs for common actions
export function DeletePasteDialog({ onDelete }: { onDelete: () => void }) {
  return (
    <ConfirmationDialog
      trigger={
        <Button variant="destructive" size="sm" className="text-xs sm:text-sm">
          Delete
        </Button>
      }
      title="Delete Paste"
      description="Are you sure you want to delete this paste? This action cannot be undone."
      confirmText="Delete"
      variant="destructive"
      onConfirm={onDelete}
    />
  );
}

export function ClearEditorDialog({ onClear }: { onClear: () => void }) {
  return (
    <ConfirmationDialog
      trigger={
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          Clear
        </Button>
      }
      title="Clear Editor"
      description="Are you sure you want to clear all content? This action cannot be undone."
      confirmText="Clear"
      variant="destructive"
      onConfirm={onClear}
    />
  );
}
