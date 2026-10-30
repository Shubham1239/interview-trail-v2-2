import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { postsByIdAtom, commentsByPostIdAtomFamily } from '../atoms/posts';
import { postByIdSelector } from '../selectors/posts';
import VoteButtons from '../components/VoteButtons';
import CommentSection from '../components/CommentSection';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import useAuth from '../hooks/useAuth';
import { fetchPostById } from '../api/posts';
import { fetchComments } from '../api/comments';
import { postEditPath } from '../routes';

export default function PostPage() {
  const params = useParams();
  const postId = params.postId;
  const auth = useAuth();
  const setPostsById = useSetRecoilState(postsByIdAtom);
  const setComments = useSetRecoilState(commentsByPostIdAtomFamily(postId));
  const post = useRecoilValue(postByIdSelector(postId));
  const [loading, setLoading] = useState(!post);

  useEffect(
    function loadPost() {
      let cancelled = false;
      Promise.all([fetchPostById(postId), fetchComments(postId)])
        .then(function onLoaded(results) {
          if (cancelled) return;
          const fetchedPost = results[0];
          const fetchedComments = results[1];
          setPostsById(function mergePost(prev) {
            return { ...prev, [fetchedPost.id]: fetchedPost };
          });
          setComments(fetchedComments);
        })
        .finally(function stopLoading() {
          if (!cancelled) setLoading(false);
        });
      return function cleanup() {
        cancelled = true;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postId]
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader label="Loading the experience…" />
      </div>
    );
  }

  if (!post) return <p className="py-16 text-center text-ink-500">Post not found.</p>;

  const isAuthor = auth.user?.id === post.author?.id;

  return (
    <article className="mx-auto max-w-2xl py-10">
      <div className="flex gap-4">
        <VoteButtons postId={post.id} score={post.score ?? 0} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold">{post.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {post.company && <Badge tone="pine">{post.company}</Badge>}
            {post.tags?.map(function renderTag(tag) {
              return <Badge key={tag}>{tag}</Badge>;
            })}
            {isAuthor && (
              <Link to={postEditPath(post.id)} className="ml-auto text-sm text-trailmark-dark">
                Edit
              </Link>
            )}
          </div>
          <div className="prose prose-sm mt-6 max-w-none whitespace-pre-wrap text-ink-800">
            {post.body}
          </div>
        </div>
      </div>
      <CommentSection postId={post.id} />
    </article>
  );
}
