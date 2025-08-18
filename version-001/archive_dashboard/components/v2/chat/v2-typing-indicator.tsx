"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Bot } from "lucide-react";

export function V2TypingIndicator() {
  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="shrink-0">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Typing Animation */}
      <div className="v2-card p-4 rounded-lg">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground mr-2">
            Thinking
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
