"use client";

import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { 
  Sparkles, 
  BarChart3, 
  Search, 
  FileText, 
  Palette,
  Code2
} from "lucide-react";

interface EmptyStateProps {
  mode: 'chat' | 'artifact' | 'split';
}

const suggestions = [
  {
    icon: BarChart3,
    title: "Analyze Performance",
    description: "Get insights into your brand's AI visibility",
    prompt: "Analyze my website's performance in AI search results"
  },
  {
    icon: Search,
    title: "Competitor Research",
    description: "Compare against your competitors",
    prompt: "Research my top competitors and their AI visibility strategies"
  },
  {
    icon: FileText,
    title: "Generate Report",
    description: "Create comprehensive analysis reports",
    prompt: "Generate a detailed brand visibility report for my website"
  },
  {
    icon: Palette,
    title: "Design Assets",
    description: "Create visual components and layouts",
    prompt: "Design a modern landing page for my SaaS product"
  },
  {
    icon: Code2,
    title: "Build Components",
    description: "Generate interactive code artifacts",
    prompt: "Create a React dashboard component with charts"
  }
];

export function EmptyState({ mode }: EmptyStateProps) {
  const handleSuggestionClick = (prompt: string) => {
    // This would typically trigger the input with the suggestion
    console.log('Suggestion clicked:', prompt);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {mode === 'artifact' 
              ? 'Ready to Create' 
              : 'Welcome to Fragment AI'}
          </h2>
          <p className="text-muted-foreground">
            {mode === 'artifact'
              ? 'Ask me to create interactive components, visualizations, or code artifacts'
              : 'Your AI-powered brand visibility assistant. Ask me anything about your online presence.'}
          </p>
        </div>

        {/* Suggestions Grid */}
        <div className="grid gap-3 mb-8">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                className="w-full p-4 h-auto text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <suggestion.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">{suggestion.title}</h3>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✨ Real-time analysis and insights</p>
          <p>🎨 Interactive artifacts and visualizations</p>
          <p>📊 Comprehensive reporting and data export</p>
        </div>
      </motion.div>
    </div>
  );
}
