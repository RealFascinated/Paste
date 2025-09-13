"use client";

import { useEffect } from "react";
import { toastUtil } from "@/common/utils/toast.util";

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onNew?: () => void;
  onDuplicate?: () => void;
  onRaw?: () => void;
  onCopyUrl?: () => void;
  onBack?: () => void;
  canSave?: boolean;
  canDuplicate?: boolean;
  canRaw?: boolean;
  canCopyUrl?: boolean;
}

export function useKeyboardShortcuts({
  onSave,
  onNew,
  onDuplicate,
  onRaw,
  onCopyUrl,
  onBack,
  canSave = false,
  canDuplicate = false,
  canRaw = false,
  canCopyUrl = false,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (onSave && canSave) {
          onSave();
        } else if (canSave) {
          toastUtil.warning("Nothing to save", {
            title: "Save",
            description: "No content available to save",
          });
        }
        return;
      }

      // Ctrl+N or Cmd+N for new paste
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        if (onNew) {
          onNew();
        }
        return;
      }

      // Ctrl+D or Cmd+D for duplicate
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        if (onDuplicate && canDuplicate) {
          onDuplicate();
        } else if (canDuplicate) {
          toastUtil.warning("Cannot duplicate", {
            title: "Duplicate",
            description: "No paste available to duplicate",
          });
        }
        return;
      }

      // Ctrl+R or Cmd+R for raw view
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        if (onRaw && canRaw) {
          onRaw();
        } else if (canRaw) {
          toastUtil.warning("Cannot view raw", {
            title: "Raw View",
            description: "No paste available to view",
          });
        }
        return;
      }

      // Ctrl+Shift+C or Cmd+Shift+C to copy paste URL
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        if (onCopyUrl && canCopyUrl) {
          onCopyUrl();
        } else if (canCopyUrl) {
          toastUtil.warning("Cannot copy URL", {
            title: "Copy URL",
            description: "No paste available to copy",
          });
        }
        return;
      }

      // Escape to go back
      if (event.key === 'Escape') {
        event.preventDefault();
        if (onBack) {
          onBack();
        } else {
          window.history.back();
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onNew, onDuplicate, onRaw, onCopyUrl, onBack, canSave, canDuplicate, canRaw, canCopyUrl]);
}

// Helper hook for create page
export function useCreatePageShortcuts(
  onSave: () => void,
  onNew: () => void,
  canSave: boolean
) {
  return useKeyboardShortcuts({
    onSave,
    onNew,
    canSave,
  });
}

// Helper hook for paste view page
export function usePasteViewShortcuts(
  onNew: () => void,
  onDuplicate: () => void,
  onRaw: () => void,
  onCopyUrl: () => void,
  onBack?: () => void,
  canDuplicate = true,
  canRaw = true,
  canCopyUrl = true
) {
  return useKeyboardShortcuts({
    onNew,
    onDuplicate,
    onRaw,
    onCopyUrl,
    onBack,
    canDuplicate,
    canRaw,
    canCopyUrl,
  });
}
