import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { commentsByPostIdAtomFamily } from '../atoms/posts';
import { createComment } from '../api/comments';
import Button from './ui/Button';
import { formatRelativeDate } from '../utils/date';
import useToast from '../hooks/useToast';

export default function CommentSection(props) {
  const postId = props.postId;
  const [comments, setComments] = useRecoilState(commentsByPostIdAtomFamily(postId));
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const showToast = useToast();

  function handleDraftChange(e) {
    setDraft(e.target.value);
  }

  async function handlePost() {
    if (!draft.trim()) return;
    setPosting(true);
    try {
      const newComment = await createComment(postId, { body: draft.trim() });
      setComments(function appendComment(prev) {
        return [...prev, newComment];
      });
      setDraft('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-medium">Comments ({comments.length})</h3>
      <div className="mb-4 flex gap-2">
        <textarea
          value={draft}
          onChange={handleDraftChange}
          placeholder="Add to the discussion…"
          className="flex-1 rounded-md border border-ink-900/15 p-2 text-sm outline-none focus:border-trailmark-dark"
          rows={2}
        />
        <Button onClick={handlePost} loading={posting} variant="accent">Post</Button>
      </div>
      <ul className="flex flex-col gap-3">
        {comments.map(function renderComment(c) {
          return (
            <li key={c.id} className="rounded-md border border-ink-900/10 p-3 text-sm">
              <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
                <span className="font-medium text-ink-800">{c.author?.name}</span>
                <span>{formatRelativeDate(c.createdAt)}</span>
              </div>
              {c.body}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
