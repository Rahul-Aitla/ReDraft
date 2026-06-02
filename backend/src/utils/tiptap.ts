import type { TipTapNode, TipTapDoc } from '../types';

export function extractText(doc: TipTapDoc): string {
  if (!doc.content) return '';
  return walkNodes(doc.content);
}

function walkNodes(nodes: TipTapNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        return node.text ?? '';
      }
      if (node.content) {
        return walkNodes(node.content);
      }
      return '';
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
