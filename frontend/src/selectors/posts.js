import { selector } from 'recoil';
import { postsByIdAtom, feedPostIdsAtom } from '../atoms/posts';

/** Derived, ordered array of full post objects for the current feed page.
 * Pages read this selector instead of re-joining ids -> posts themselves. */

// it returns the full post objects for the current feed page, in the order specified by feedPostIdsAtom. It reads from postsByIdAtom to get the actual post data.
export const feedPostsSelector = selector({
  key: 'feedPosts',
  get: function get({ get }) {
    const byId = get(postsByIdAtom);
    const ids = get(feedPostIdsAtom);
    return ids.map(function lookup(id) {
      return byId[id];
    }).filter(Boolean);
  },
});

/** Selector for a single post by id — safe to read even if the feed was
 * never loaded first (e.g. landing directly on a post's URL). */
// it returns the full post object for a given post ID, or null if not found. It reads from postsByIdAtom to get the actual post data.
export function postByIdSelector(postId) {
  return selector({
    key: `postById/${postId}`,
    get: function get({ get }) {
      return get(postsByIdAtom)[postId] ?? null;
    },
  });
}
