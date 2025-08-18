'use client';

import { initialArtifactData, useArtifact } from '@/hooks/use-artifact';
import { useEffect, useRef } from 'react';
import { artifactDefinitions } from './artifact';
import { useDataStream } from './data-stream-provider';

export function DataStreamHandler() {
  const { dataStream } = useDataStream();

  const { artifact, setArtifact, setMetadata } = useArtifact();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    console.log('📊 DataStreamHandler - Processing data stream:', {
      totalLength: dataStream.length,
      lastProcessedIndex: lastProcessedIndex.current,
      newDeltas: dataStream.length - (lastProcessedIndex.current + 1),
    });

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    console.log(
      '🔄 DataStreamHandler - Processing new deltas:',
      newDeltas.length,
    );

    newDeltas.forEach((delta, index) => {
      console.log(`📝 DataStreamHandler - Processing delta ${index}:`, {
        type: delta.type,
        data: delta.data || 'no data',
      });

      const artifactDefinition = artifactDefinitions.find(
        (artifactDefinition) => artifactDefinition.kind === artifact.kind,
      );

      if (artifactDefinition?.onStreamPart) {
        console.log(
          '🎨 DataStreamHandler - Calling artifact onStreamPart for:',
          artifact.kind,
        );
        artifactDefinition.onStreamPart({
          streamPart: delta,
          setArtifact,
          setMetadata,
        });
      }

      setArtifact((draftArtifact) => {
        console.log('🔄 DataStreamHandler - Updating artifact:', {
          currentStatus: draftArtifact?.status,
          deltaType: delta.type,
        });

        if (!draftArtifact) {
          console.log('🆕 DataStreamHandler - Creating new artifact');
          return { ...initialArtifactData, status: 'streaming' };
        }

        switch (delta.type) {
          case 'data-id':
            console.log(
              '🆔 DataStreamHandler - Setting artifact document ID:',
              delta.data,
            );
            return {
              ...draftArtifact,
              documentId: delta.data,
              status: 'streaming',
            };

          case 'data-title':
            console.log(
              '📝 DataStreamHandler - Setting artifact title:',
              delta.data,
            );
            return {
              ...draftArtifact,
              title: delta.data,
              status: 'streaming',
            };

          case 'data-kind':
            console.log(
              '🎨 DataStreamHandler - Setting artifact kind:',
              delta.data,
            );
            return {
              ...draftArtifact,
              kind: delta.data,
              status: 'streaming',
            };

          case 'data-clear':
            console.log('🧹 DataStreamHandler - Clearing artifact content');
            return {
              ...draftArtifact,
              content: '',
              status: 'streaming',
            };

          case 'data-finish':
            console.log('✅ DataStreamHandler - Finishing artifact');
            return {
              ...draftArtifact,
              status: 'idle',
            };

          default:
            console.log(
              '❓ DataStreamHandler - Unknown delta type:',
              delta.type,
            );
            return draftArtifact;
        }
      });
    });
  }, [dataStream, setArtifact, setMetadata, artifact]);

  return null;
}
