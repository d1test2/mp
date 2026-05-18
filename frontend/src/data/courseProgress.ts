export function safeVideoProgressMap(input: any): {
  completedVideoIds: Set<string>;
  completedByVideoId: Map<string, boolean>;
} {
  const completedVideoIds = new Set<string>();
  const completedByVideoId = new Map<string, boolean>();

  if (!Array.isArray(input)) return { completedVideoIds, completedByVideoId };
  for (const row of input) {
    if (!row?.videoId) continue;
    const completed = !!row?.completed;
    completedByVideoId.set(row.videoId, completed);
    if (completed) completedVideoIds.add(row.videoId);
  }

  return { completedVideoIds, completedByVideoId };
}

