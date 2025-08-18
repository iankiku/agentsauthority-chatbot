"use client";

import { Button } from "@workspace/ui/components/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorFallbackProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

export function ErrorFallback({ error, onRetry, className }: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="v2-card p-6 max-w-md w-full">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          Something went wrong
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          {error || "An unexpected error occurred. Please try again."}
        </p>
        
        <Button
          onClick={onRetry}
          className="v2-button-primary w-full"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}
