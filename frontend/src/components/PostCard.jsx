import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import VoteButtons from './VoteButtons';
import { formatRelativeDate } from '../utils/date';
import { postDetailPath } from '../routes';

export default function PostCard(props) {
  const post = props.post;

  return (
    <Card className="flex gap-4">
      <VoteButtons postId={post.id} score={post.score ?? 0} />
      <div className="min-w-0 flex-1">
        <Link to={postDetailPath(post.id)} className="block">
          <h3 className="font-display text-lg font-medium hover:text-trailmark-dark">
            {post.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {post.company && <Badge tone="pine">{post.company}</Badge>}
          {post.tags?.map(function renderTag(tag) {
            return <Badge key={tag} tone="neutral">{tag}</Badge>;
          })}
          <span className="ml-auto text-xs text-ink-300">
            {formatRelativeDate(post.createdAt)} · {post.commentCount ?? 0} comments
          </span>
        </div>
      </div>
    </Card>
  );
}
