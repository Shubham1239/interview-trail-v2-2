import { useRecoilState } from 'recoil';
import { myVoteByPostIdAtomFamily } from '../atoms/posts';
import { votePost } from '../api/posts';
import useToast from '../hooks/useToast';

export default function VoteButtons(props) {
  const postId = props.postId;
  const score = props.score;
  const [myVote, setMyVote] = useRecoilState(myVoteByPostIdAtomFamily(postId));
  const showToast = useToast();

  async function castVote(direction) {
    const next = myVote === direction ? 0 : direction; // click again to undo
    const prev = myVote;
    setMyVote(next); // optimistic
    try {
      await votePost(postId, next);
    } catch (err) {
      setMyVote(prev);
      showToast(err.message, 'error');
    }
  }

  function handleUpvote() {
    castVote(1);
  }

  function handleDownvote() {
    castVote(-1);
  }

  return (
    <div className="flex flex-col items-center gap-0.5 text-ink-500">
      <button
        aria-label="Upvote"
        onClick={handleUpvote}
        className={`rounded-sm px-1.5 ${myVote === 1 ? 'text-trailmark-dark' : 'hover:text-ink-900'}`}
      >
        ▲
      </button>
      <span className="text-sm font-medium text-ink-900">{score}</span>
      <button
        aria-label="Downvote"
        onClick={handleDownvote}
        className={`rounded-sm px-1.5 ${myVote === -1 ? 'text-brick' : 'hover:text-ink-900'}`}
      >
        ▼
      </button>
    </div>
  );
}
