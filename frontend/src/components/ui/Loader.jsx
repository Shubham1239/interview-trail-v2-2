export default function Loader(props) {
  const label = props.label || 'Loading…';
  const className = props.className || '';
  return (
    <div className={`flex items-center gap-2 text-sm text-ink-500 ${className}`} role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-trailmark-dark" />
      {label}
    </div>
  );
}
// This component renders a loading indicator with an optional label. It displays a spinning circle and the provided label text, styled with Tailwind CSS classes. The `role="status"` attribute indicates that this is a status message for accessibility purposes.

/** Placeholder block for feed/card skeletons while data is loading. */
export function SkeletonBlock(props) {
  const className = props.className || '';
  return <div className={`animate-pulse rounded-md bg-ink-900/8 ${className}`} />;
}
// This component renders a skeleton placeholder for feed/card items while data is loading. It uses a pulse animation to indicate the loading state.