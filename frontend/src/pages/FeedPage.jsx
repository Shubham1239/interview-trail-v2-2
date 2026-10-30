import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Loader, { SkeletonBlock } from '../components/ui/Loader';
import { feedFiltersAtom } from '../atoms/filters';
import { postsByIdAtom, feedPostIdsAtom, feedPaginationAtom } from '../atoms/posts';
import { feedPostsSelector } from '../selectors/posts';
import useDebounce from '../hooks/useDebounce';
import { fetchPosts } from '../api/posts';

export default function FeedPage() {
  const filters = useRecoilValue(feedFiltersAtom);
  const debouncedSearch = useDebounce(filters.searchTerm, 400);
  const posts = useRecoilValue(feedPostsSelector);
  const pagination = useRecoilValue(feedPaginationAtom);
  const setPostsById = useSetRecoilState(postsByIdAtom);
  const setFeedIds = useSetRecoilState(feedPostIdsAtom);
  const setPagination = useSetRecoilState(feedPaginationAtom);
  const [status, setStatus] = useState('loading');

  useEffect(
    function loadFeed() {
      let cancelled = false;
      setStatus('loading');

      fetchPosts({ ...filters, searchTerm: debouncedSearch, page: 1 })
        .then(function onLoaded(data) {
          if (cancelled) return;
          setPostsById(function mergePosts(prev) {
            const next = { ...prev };
            data.items.forEach(function addPost(p) {
              next[p.id] = p;
            });
            return next;
          });
          setFeedIds(
            data.items.map(function toId(p) {
              return p.id;
            })
          );
          setPagination({ page: data.page, pageSize: pagination.pageSize, totalPages: data.totalPages, totalCount: data.totalCount });
          setStatus('success');
        })
        .catch(function onError() {
          if (!cancelled) setStatus('error');
        });

      return function cleanup() {
        cancelled = true;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearch, filters.sortBy, filters.tags, filters.company]
  );

  return (
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="mb-1 font-display text-3xl font-semibold">Interview experiences</h1>
      <p className="mb-6 text-ink-500">Real rounds, real questions, shared by people who sat them.</p>

      <SearchBar />

      {status === 'loading' && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map(function renderSkeleton(i) {
            return <SkeletonBlock key={i} className="h-24" />;
          })}
        </div>
      )}
      {status === 'error' && <p className="text-brick">Couldn't load the feed. Try refreshing.</p>}
      {status === 'success' && posts.length === 0 && (
        <p className="text-ink-500">No experiences match yet — be the first to share one.</p>
      )}
      <div className="flex flex-col gap-4">
        {posts.map(function renderPost(post) {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
    </div>
  );
}
