import { atom, atomFamily } from 'recoil';

/** Normalized post store: { [postId]: post }. Every page reads posts
 * from here so the feed, detail page, and edit form never go out of sync. */
// sab posts ka actual data store karta hai
export const postsByIdAtom = atom({
  key: 'postsById',
  default: {},
});

/** Ordered post ids for the current feed page/query. */
// sirf kaunsi IDs, kis ORDER mein
export const feedPostIdsAtom = atom({
  key: 'feedPostIds',
  default: [],
});

// pagination info for the current feed page/query, used to determine if there are more pages to load
export const feedPaginationAtom = atom({
  key: 'feedPagination',
  default: { page: 1, pageSize: 10, totalPages: 1, totalCount: 0 },
});

// status of the current feed query, used to show loading spinners and error messages
export const feedStatusAtom = atom({
  key: 'feedStatus',
  default: 'idle', // 'idle' | 'loading' | 'success' | 'error'
});

/** Comment ids per post, keyed by postId — loaded on demand when a post
 * detail page opens, not upfront with the feed. */
// ye atom family hai, jismein har postId ke liye alag alag comment ids store hote hain and unka data 
export const commentsByPostIdAtomFamily = atomFamily({
  key: 'commentsByPostId',
  default: [],
});

/** The current user's own vote on a post, keyed by postId. */
// ye atom family hai, jismein har postId ke liye alag alag vote store hote hain and unka data
export const myVoteByPostIdAtomFamily = atomFamily({
  key: 'myVoteByPostId',
  default: 0, // -1 | 0 | 1
});
