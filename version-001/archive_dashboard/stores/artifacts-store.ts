import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UIMessage } from '@ai-sdk/react';

export interface PinnedArtifact {
  id: string;
  messageId: string;
  type: string;
  title: string;
  data: any;
  pinnedAt: Date;
  conversationId?: string;
  tags?: string[];
}

interface ArtifactsState {
  // Pinned artifacts
  pinnedArtifacts: PinnedArtifact[];
  
  // UI state
  showPinnedPanel: boolean;
  selectedArtifactId: string | null;
  
  // Actions
  pinArtifact: (message: UIMessage, title?: string, tags?: string[]) => void;
  unpinArtifact: (artifactId: string) => void;
  updateArtifactTitle: (artifactId: string, title: string) => void;
  updateArtifactTags: (artifactId: string, tags: string[]) => void;
  clearPinnedArtifacts: () => void;
  
  // UI actions
  setShowPinnedPanel: (show: boolean) => void;
  setSelectedArtifactId: (id: string | null) => void;
  
  // Utility functions
  isPinned: (messageId: string) => boolean;
  getPinnedArtifact: (messageId: string) => PinnedArtifact | undefined;
  getPinnedArtifactsByType: (type: string) => PinnedArtifact[];
}

const extractArtifactFromMessage = (message: UIMessage): { type: string; data: any } | null => {
  if (!message.toolInvocations || message.toolInvocations.length === 0) {
    return null;
  }
  
  const toolInvocation = message.toolInvocations[0];
  if (!('result' in toolInvocation) || !toolInvocation.result) {
    return null;
  }
  
  const artifact = toolInvocation.result as any;
  return {
    type: artifact.type || 'unknown',
    data: artifact.data || artifact
  };
};

const generateArtifactTitle = (type: string, data: any): string => {
  switch (type) {
    case 'geo_score_card':
      return `GEO Score Analysis - ${data?.overallScore || 'N/A'}`;
    case 'competitor_matrix':
      return `Competitor Analysis - ${data?.competitors?.length || 0} competitors`;
    case 'data_table':
      return `Data Table - ${data?.rows?.length || 0} rows`;
    case 'line_chart':
      return `Line Chart - ${data?.title || 'Chart'}`;
    default:
      return `${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Artifact`;
  }
};

export const useArtifactsStore = create<ArtifactsState>()(
  devtools(
    persist(
      (set, get) => ({
        pinnedArtifacts: [],
        showPinnedPanel: false,
        selectedArtifactId: null,
        
        pinArtifact: (message, title, tags = []) => {
          const artifact = extractArtifactFromMessage(message);
          if (!artifact) return;
          
          const existingPinned = get().pinnedArtifacts.find(p => p.messageId === message.id);
          if (existingPinned) return; // Already pinned
          
          const pinnedArtifact: PinnedArtifact = {
            id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            messageId: message.id,
            type: artifact.type,
            title: title || generateArtifactTitle(artifact.type, artifact.data),
            data: artifact.data,
            pinnedAt: new Date(),
            tags,
          };
          
          set((state) => ({
            pinnedArtifacts: [pinnedArtifact, ...state.pinnedArtifacts].slice(0, 50) // Keep max 50 pinned
          }), false, 'pinArtifact');
        },
        
        unpinArtifact: (artifactId) => {
          set((state) => ({
            pinnedArtifacts: state.pinnedArtifacts.filter(p => p.id !== artifactId)
          }), false, 'unpinArtifact');
        },
        
        updateArtifactTitle: (artifactId, title) => {
          set((state) => ({
            pinnedArtifacts: state.pinnedArtifacts.map(p => 
              p.id === artifactId ? { ...p, title } : p
            )
          }), false, 'updateArtifactTitle');
        },
        
        updateArtifactTags: (artifactId, tags) => {
          set((state) => ({
            pinnedArtifacts: state.pinnedArtifacts.map(p => 
              p.id === artifactId ? { ...p, tags } : p
            )
          }), false, 'updateArtifactTags');
        },
        
        clearPinnedArtifacts: () => {
          set({ pinnedArtifacts: [] }, false, 'clearPinnedArtifacts');
        },
        
        setShowPinnedPanel: (show) => {
          set({ showPinnedPanel: show }, false, 'setShowPinnedPanel');
        },
        
        setSelectedArtifactId: (id) => {
          set({ selectedArtifactId: id }, false, 'setSelectedArtifactId');
        },
        
        isPinned: (messageId) => {
          return get().pinnedArtifacts.some(p => p.messageId === messageId);
        },
        
        getPinnedArtifact: (messageId) => {
          return get().pinnedArtifacts.find(p => p.messageId === messageId);
        },
        
        getPinnedArtifactsByType: (type) => {
          return get().pinnedArtifacts.filter(p => p.type === type);
        },
      }),
      {
        name: 'artifacts-store',
        partialize: (state) => ({
          pinnedArtifacts: state.pinnedArtifacts,
          showPinnedPanel: state.showPinnedPanel,
        }),
      }
    ),
    { name: 'artifacts-store' }
  )
);
