import * as Diff from 'diff';
import { PostVersion } from '../models';
import { extractText } from '../utils/tiptap';
import type { DiffSegment } from '../types';
import { AppError } from '../middleware/errorHandler';

export async function computeDiff(versionAId: string, versionBId: string): Promise<DiffSegment[]> {
  const versionA = await PostVersion.findByPk(versionAId);
  const versionB = await PostVersion.findByPk(versionBId);

  if (!versionA || !versionB) {
    throw new AppError(404, 'VERSION_NOT_FOUND', 'One or both versions not found');
  }

  const textA = extractText(versionA.content);
  const textB = extractText(versionB.content);

  // Split into word-level tokens for readable diff
  const wordsA = textA.split(/(\s+)/);
  const wordsB = textB.split(/(\s+)/);

  const changes = Diff.diffArrays(wordsA, wordsB);

  return changes.map((part) => ({
    type: part.added ? 'insert' : part.removed ? 'delete' : 'equal',
    text: part.value.join(''),
  }));
}
