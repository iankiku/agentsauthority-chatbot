"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@workspace/ui/components/dropdown-menu";
import { 
  Pin, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Calendar,
  Tag
} from "lucide-react";
import { useArtifactsStore } from "@/stores/artifacts-store";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@workspace/utils";

interface PinnedArtifactsPanelProps {
  className?: string;
}

export function PinnedArtifactsPanel({ className }: PinnedArtifactsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const { 
    pinnedArtifacts, 
    unpinArtifact, 
    updateArtifactTitle,
    setSelectedArtifactId,
    clearPinnedArtifacts 
  } = useArtifactsStore();

  // Filter artifacts based on search and type
  const filteredArtifacts = pinnedArtifacts.filter(artifact => {
    const matchesSearch = artifact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artifact.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || artifact.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get unique artifact types for filtering
  const artifactTypes = Array.from(new Set(pinnedArtifacts.map(a => a.type)));

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'geo_score_card':
        return '📊';
      case 'competitor_matrix':
        return '🏆';
      case 'data_table':
        return '📋';
      case 'line_chart':
        return '📈';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'geo_score_card':
        return 'bg-blue-100 text-blue-800';
      case 'competitor_matrix':
        return 'bg-purple-100 text-purple-800';
      case 'data_table':
        return 'bg-green-100 text-green-800';
      case 'line_chart':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pin className="h-5 w-5 text-brand-600" />
            Pinned Artifacts
            <Badge variant="secondary" className="ml-2">
              {pinnedArtifacts.length}
            </Badge>
          </CardTitle>
          {pinnedArtifacts.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={clearPinnedArtifacts}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {artifactTypes.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                All
              </Button>
              {artifactTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  {getArtifactIcon(type)} {type.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6 pb-6">
          {filteredArtifacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {pinnedArtifacts.length === 0 ? (
                <div className="space-y-2">
                  <Pin className="h-12 w-12 mx-auto opacity-20" />
                  <p>No pinned artifacts yet</p>
                  <p className="text-sm">Pin artifacts from chat to access them quickly</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Search className="h-8 w-8 mx-auto opacity-20" />
                  <p>No artifacts match your search</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArtifacts.map((artifact, index) => (
                <div key={artifact.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getArtifactIcon(artifact.type)}</span>
                            <h4 className="font-medium truncate">{artifact.title}</h4>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(artifact.type)} variant="secondary">
                              {artifact.type.replace(/_/g, ' ')}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(artifact.pinnedAt, { addSuffix: true })}
                            </div>
                          </div>
                          
                          {artifact.tags && artifact.tags.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <Tag className="h-3 w-3 text-muted-foreground" />
                              {artifact.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedArtifactId(artifact.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => unpinArtifact(artifact.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Unpin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                  {index < filteredArtifacts.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
