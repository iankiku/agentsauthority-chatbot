/**
 * Data Stream Provider
 * 
 * Manages streaming data for artifacts and UI updates
 * Similar to Vercel's AI Chatbot data stream handling
 */

'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export interface DataStreamPart {
  type: 'text' | 'artifact' | 'tool-call' | 'tool-result' | 'error';
  content?: string;
  data?: any;
  timestamp?: Date;
  id?: string;
}

interface DataStreamContextValue {
  dataStream: DataStreamPart[];
  setDataStream: React.Dispatch<React.SetStateAction<DataStreamPart[]>>;
  addDataPart: (part: DataStreamPart) => void;
  clearDataStream: () => void;
}

const DataStreamContext = createContext<DataStreamContextValue | null>(null);

export function DataStreamProvider({ children }: { children: React.ReactNode }) {
  const [dataStream, setDataStream] = useState<DataStreamPart[]>([]);

  const addDataPart = useMemo(
    () => (part: DataStreamPart) => {
      const partWithTimestamp = {
        ...part,
        timestamp: new Date(),
        id: part.id || `${Date.now()}-${Math.random()}`,
      };
      
      setDataStream(prev => [...prev, partWithTimestamp]);
    },
    []
  );

  const clearDataStream = useMemo(
    () => () => setDataStream([]),
    []
  );

  const value = useMemo(
    () => ({ 
      dataStream, 
      setDataStream, 
      addDataPart, 
      clearDataStream 
    }),
    [dataStream, addDataPart, clearDataStream]
  );

  return (
    <DataStreamContext.Provider value={value}>
      {children}
    </DataStreamContext.Provider>
  );
}

export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (!context) {
    throw new Error('useDataStream must be used within a DataStreamProvider');
  }
  return context;
}

/**
 * Hook to process streaming data and extract artifacts
 */
export function useStreamProcessor() {
  const { dataStream, addDataPart } = useDataStream();

  const processStreamChunk = useMemo(
    () => (chunk: string) => {
      // Look for artifact patterns in the stream
      const artifactPattern = /<artifact\s+type="([^"]+)"(?:\s+title="([^"]*)")?[^>]*>([\s\S]*?)<\/artifact>/g;
      const matches = [...chunk.matchAll(artifactPattern)];

      if (matches.length > 0) {
        matches.forEach(match => {
          const [, type, title, content] = match;
          addDataPart({
            type: 'artifact',
            data: {
              type,
              title: title || 'Untitled',
              content: content.trim(),
            },
            content: chunk,
          });
        });
      } else if (chunk.includes('error') || chunk.includes('Error:')) {
        addDataPart({
          type: 'error',
          content: chunk,
        });
      } else {
        addDataPart({
          type: 'text',
          content: chunk,
        });
      }
    },
    [addDataPart]
  );

  const artifacts = useMemo(() => {
    return dataStream
      .filter(part => part.type === 'artifact')
      .map(part => part.data);
  }, [dataStream]);

  const errors = useMemo(() => {
    return dataStream
      .filter(part => part.type === 'error')
      .map(part => part.content);
  }, [dataStream]);

  return {
    processStreamChunk,
    artifacts,
    errors,
    dataStream,
  };
}