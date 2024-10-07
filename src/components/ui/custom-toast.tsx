"use client"

import * as React from "react"
import { Toaster as Sonner } from "sonner"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react"

type ToastProps = React.ComponentProps<typeof Sonner>

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: AlertCircle,
  delete: Trash2,
}

export function Toaster({ ...props }: ToastProps) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToastProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      position="top-right"
    //   offset="0px"
    //   expand={false}
      {...props}
    />
  )
}

interface CustomToastProps {
  title?: string
  description?: string
  variant?: keyof typeof iconMap
}

export function CustomToast({ title, description, variant = "info" }: CustomToastProps) {
  const Icon = iconMap[variant]
  
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg p-4 shadow-sm",
      variant === "success" && "bg-green-500 text-white",
      variant === "error" && "bg-red-500 text-white",
      variant === "info" && "bg-blue-500 text-white",
      variant === "delete" && "bg-orange-500 text-white"
    )}>
      <div className="rounded-full bg-white p-1">
        <Icon className={cn(
          "h-5 w-5",
          variant === "success" && "text-green-500",
          variant === "error" && "text-red-500",
          variant === "info" && "text-blue-500",
          variant === "delete" && "text-orange-500"
        )} />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
    </div>
  )
}

export { toast } from "sonner"