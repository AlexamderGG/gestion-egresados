import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
        destructive: "bg-error-600 text-white hover:bg-error-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)