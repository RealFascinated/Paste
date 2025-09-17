import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastColors = {
  success: "text-green-300",
  error: "text-red-300",
  info: "text-blue-300",
  warning: "text-yellow-300",
};

function createToast(
  type: ToastType,
  message: string,
  options: ToastOptions = {}
) {
  const Icon = toastIcons[type];
  const colorClass = toastColors[type];

  const toastOptions = {
    duration: options.duration || (type === "error" ? 5000 : 3000),
    action: options.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  };

  if (options.title) {
    return toast[type](options.title, {
      description: message,
      icon: <Icon className={`w-4 h-4 ${colorClass}`} />,
      ...toastOptions,
    });
  }

  return toast[type](message, {
    icon: <Icon className={`w-4 h-4 ${colorClass}`} />,
    ...toastOptions,
  });
}

export const toastUtil = {
  success: (message: string, options?: ToastOptions) =>
    createToast("success", message, options),

  error: (message: string, options?: ToastOptions) =>
    createToast("error", message, options),

  info: (message: string, options?: ToastOptions) =>
    createToast("info", message, options),

  warning: (message: string, options?: ToastOptions) =>
    createToast("warning", message, options),

  // Specific toast functions for common actions
  pasteCreated: (pasteUrl: string) =>
    toastUtil.success("Paste created successfully!", {
      title: "Success",
      description: "Your paste has been created and copied to clipboard",
      action: {
        label: "Copy URL",
        onClick: () => navigator.clipboard.writeText(pasteUrl),
      },
    }),

  pasteSaved: () =>
    toastUtil.success("Paste saved!", {
      title: "Saved",
      description: "Your changes have been saved successfully",
    }),

  pasteDeleted: () =>
    toastUtil.success("Paste deleted", {
      title: "Deleted",
      description: "The paste has been permanently deleted",
    }),

  pasteDownloaded: (filename: string) =>
    toastUtil.success("Download started", {
      title: "Downloading",
      description: `Downloading ${filename}...`,
    }),

  pasteCopied: (text: string) =>
    toastUtil.success("Copied to clipboard", {
      title: "Copied",
      description: `${text.length} characters copied`,
    }),

  pasteEmpty: () =>
    toastUtil.error("Paste cannot be empty", {
      title: "Empty Paste",
      description: "Please enter some content before saving",
    }),

  pasteTooLarge: (maxSize: string) =>
    toastUtil.error("Paste too large", {
      title: "Size Limit Exceeded",
      description: `Maximum size is ${maxSize}`,
    }),

  networkError: () =>
    toastUtil.error("Network error", {
      title: "Connection Failed",
      description: "Please check your internet connection and try again",
    }),

  serverError: (message?: string) =>
    toastUtil.error(message || "Server error occurred", {
      title: "Server Error",
      description: "Something went wrong on our end. Please try again later.",
    }),

  pasteNotFound: () =>
    toastUtil.error("Paste not found", {
      title: "404 Error",
      description: "This paste may have expired or been deleted",
    }),

  pasteExpired: () =>
    toastUtil.warning("Paste has expired", {
      title: "Expired",
      description: "This paste is no longer available",
    }),

  unsavedChanges: () =>
    toastUtil.warning("You have unsaved changes", {
      title: "Unsaved Changes",
      description: "Your changes will be lost if you leave this page",
    }),

  loading: (message: string) =>
    toast.loading(message, {
      id: "loading",
    }),

  dismissLoading: () => toast.dismiss("loading"),
};
