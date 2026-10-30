const TONES = {
  neutral: 'bg-ink-900/8 text-ink-800',
  accent: 'bg-trailmark-light text-ink-900',
  pine: 'bg-pine/15 text-pine-dark',
  brick: 'bg-brick/15 text-brick-dark',
};

export default function Badge(props) {
  const tone = props.tone || 'neutral';
  const className = props.className || '';
  return (
    <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}>
      {props.children}
    </span>
  );
}
// This component renders a badge with a specified tone (color scheme) and optional additional classes. It uses Tailwind CSS classes for styling and displays any children passed to it.