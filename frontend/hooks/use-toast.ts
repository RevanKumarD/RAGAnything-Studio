import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export function useToast() {
  const toast = ({ title, description, variant = "default", duration = 3000 }: ToastProps) => {
    const message = title || description || "";
    const desc = title && description ? description : undefined;

    if (variant === "destructive") {
      sonnerToast.error(message, {
        description: desc,
        duration,
      });
    } else {
      sonnerToast.success(message, {
        description: desc,
        duration,
      });
    }
  };

  return { toast };
}
