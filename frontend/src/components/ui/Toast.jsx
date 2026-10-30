import { useRecoilValue } from 'recoil';
import { toastQueueAtom } from '../../atoms/toast';

const TONE_CLASSES = {
  success: 'bg-pine text-white',
  error: 'bg-brick text-white',
  info: 'bg-ink-900 text-paper',
};

function ToastItem(props) {
  const toast = props.toast;
  return (
    <div role="status" className={`rounded-md px-4 py-2 text-sm shadow-md ${TONE_CLASSES[toast.type] || TONE_CLASSES.info}`}>
      {toast.message}
    </div>
  );
}

/** Mounted once near the root; any page pushes into the queue via useToast. */
export default function ToastViewport() {
  const toasts = useRecoilValue(toastQueueAtom);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(function renderToast(toast) {
        return <ToastItem key={toast.id} toast={toast} />;
      })}
    </div>
  );
}
