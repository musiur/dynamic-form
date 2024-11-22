/**
 * @author: github.com/musiur
 * date: 29 May, 2024
 *
 * @description Unified & reusable SUBMIT component
 *
 * @params pending, icon, text, className
 * pending: submission state - async awaiting
 * icon: React Component or, falsy value
 * text: Text to display with Button
 * className: utility classlist for customizations
 */

import { ReactElement } from "react";
import { Button } from "../ui/button";
import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const SubmitX = ({
  pending = false,
  icon = null,
  text,
  className,
  action,
  disabled = false,
  variant = "default",
}: {
  pending: boolean;
  icon?: ReactElement | null | undefined;
  text?: string;
  className?: string;
  action?: Function;
  disabled?: boolean;
  variant?: "default" | "outline" | "destructive";
}) => {
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={cn(className, "items-center gap-2")}
      onClick={() => action && action()}
      variant={variant}
    >
      {pending ? <Sun className="w-4 h-4 animate-spin" /> : null}
      {text}
      {pending ? null : icon}
    </Button>
  );
};

export default SubmitX;