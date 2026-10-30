import { atom } from 'recoil';

/** Queue of toast notifications. Each item: { id, type, message }. */
// ye atom ek queue maintain karta hai jismein har toast notification ka data store hota hai, jaise ki id, type (success, error, info), aur message.
export const toastQueueAtom = atom({
  key: 'toastQueue',
  default: [],
});
