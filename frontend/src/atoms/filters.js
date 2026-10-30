import { atom } from 'recoil';

/** Every feed-query knob lives in one atom, so "reset filters" and future
 * URL-syncing only ever have one value to read/write. */
//  ye atom feed ke liye saare filters ka data store karta hai, jaise ki search term, tags, sort order, aur company filter. Isse "reset filters" aur future URL-syncing ke liye sirf ek value read/write karni hoti hai.
export const feedFiltersAtom = atom({
  key: 'feedFilters',
  default: {
    searchTerm: '',
    tags: [],
    sortBy: 'recent', // 'recent' | 'top'
    company: null,
  },
});
