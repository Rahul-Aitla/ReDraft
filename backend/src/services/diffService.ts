import * as Diff from 'diff';
import { PostVersion } from '../models';
import type { DiffSegment } from '../types';
import { AppError } from '../middleware/errorHandler';

interface Token {
  text: string;
  key: string;
}

function tokenizeDoc(doc: any): Token[] {
  const tokens: Token[] = [];

  function walk(node: any) {
    if (!node) return;

    // If it's a text node, add text tokens
    if (node.type === 'text' && node.text) {
      const marks = node.marks ? node.marks.map((m: any) => m.type) : [];
      // Split text into words and spaces/punctuation to diff at word level
      const parts = node.text.split(/(\s+)/);
      for (const part of parts) {
        if (part) {
          tokens.push({
            text: part,
            key: `${part}|${marks.sort().join(',')}`,
          });
        }
      }
      return;
    }

    if (node.type === 'hardBreak') {
      tokens.push({ text: '\n', key: '\n' });
      return;
    }

    // Process block-level start
    const isBlock = ['paragraph', 'heading', 'blockquote', 'codeBlock', 'listItem'].includes(node.type);

    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any) => walk(child));
    }

    // Process block-level end (add newlines)
    if (isBlock) {
      if (['paragraph', 'heading', 'blockquote', 'codeBlock'].includes(node.type)) {
        tokens.push({ text: '\n\n', key: '\n\n' });
      } else if (node.type === 'listItem') {
        tokens.push({ text: '\n', key: '\n' });
      }
    }
  }

  if (doc && doc.content && Array.isArray(doc.content)) {
    doc.content.forEach((child: any) => walk(child));
  }

  // Clean up trailing double newlines to avoid extra blank lines at the end of diffs
  while (
    tokens.length > 0 &&
    (tokens[tokens.length - 1].text === '\n' || tokens[tokens.length - 1].text === '\n\n')
  ) {
    tokens.pop();
  }

  return tokens;
}

export async function computeDiff(versionAId: string, versionBId: string): Promise<DiffSegment[]> {
  const versionA = await PostVersion.findByPk(versionAId);
  const versionB = await PostVersion.findByPk(versionBId);

  if (!versionA || !versionB) {
    throw new AppError(404, 'VERSION_NOT_FOUND', 'One or both versions not found');
  }

  const tokensA = tokenizeDoc(versionA.content);
  const tokensB = tokenizeDoc(versionB.content);

  const changes = Diff.diffArrays<Token>(tokensA, tokensB, {
    comparator: (a, b) => a.key === b.key,
  });

  return changes.map((part) => ({
    type: part.added ? 'insert' : part.removed ? 'delete' : 'equal',
    text: part.value.map((t) => t.text).join(''),
  }));
}
