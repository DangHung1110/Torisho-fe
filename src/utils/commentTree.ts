// src/utils/commentTree.ts
import { DictionaryComment } from '../types/dictionary';
export function flattenCommentTree(comments: DictionaryComment[]): DictionaryComment[] {
  const result: DictionaryComment[] = [];

  const walk = (nodes: DictionaryComment[]) => {
    for (const node of nodes) {
      const children = Array.isArray(node.replies) ? node.replies : [];
      result.push({ ...node, replies: [] });
      if (children.length > 0) walk(children);
    }
  };

  walk(comments);
  return result;
}

function sortNewestFirst(a: DictionaryComment, b: DictionaryComment) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function sortOldestFirst(a: DictionaryComment, b: DictionaryComment) {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function sortRepliesRecursively(node: DictionaryComment): void {
  node.replies.sort(sortOldestFirst);
  node.replies.forEach(sortRepliesRecursively);
}

export function buildCommentTree(comments: DictionaryComment[]): DictionaryComment[] {
  const byId = new Map<string, DictionaryComment>();
  for (const item of flattenCommentTree(comments)) {
    if (!byId.has(item.id)) {
      byId.set(item.id, { ...item, replies: [] });
    }
  }

  const roots: DictionaryComment[] = [];

  for (const node of byId.values()) {
    if (node.parentCommentId && byId.has(node.parentCommentId)) {
      byId.get(node.parentCommentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  roots.sort(sortNewestFirst);
  roots.forEach(sortRepliesRecursively);

  return roots;
}

export function insertCommentIntoTree(
  existing: DictionaryComment[],
  created: DictionaryComment,
): DictionaryComment[] {
  const flat = [...flattenCommentTree(existing), { ...created, replies: [] }];
  return buildCommentTree(flat);
}