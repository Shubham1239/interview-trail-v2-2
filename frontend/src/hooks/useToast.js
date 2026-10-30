import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { toastQueueAtom } from '../atoms/toast';

// It provides a hook to show toast notifications. When called, it adds a new toast to the queue and automatically removes it after 4 seconds.
let idCounter = 0;

export default function useToast() {
  const setQueue = useSetRecoilState(toastQueueAtom);

  const showToast = useCallback(
    function showToast(message, type) {
      const toastType = type || 'info';
      const id = ++idCounter;
      setQueue(function addToast(queue) {
        return [...queue, { id, message, type: toastType }];
      });
      setTimeout(function removeToast() {
        setQueue(function filterOut(queue) {
          return queue.filter(function notThisOne(t) {
            return t.id !== id;
          });
        });
      }, 4000);
    },
    [setQueue]
  );

  return showToast;
}
