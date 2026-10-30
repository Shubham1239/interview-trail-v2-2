const VARIANTS = {
  primary: 'bg-ink-900 text-paper hover:bg-ink-800',
  accent: 'bg-trailmark text-ink-950 hover:bg-trailmark-dark',
  ghost: 'bg-transparent text-ink-800 hover:bg-ink-900/5',
  danger: 'bg-brick text-paper hover:bg-brick-dark',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button(props) {
  const variant = props.variant || 'primary';
  const size = props.size || 'md';
  const loading = props.loading || false;
  const disabled = props.disabled || false;
  const className = props.className || '';

  return (
    <button
      disabled={disabled || loading}
      onClick={props.onClick}
      type={props.type}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium
        transition-colors disabled:cursor-not-allowed disabled:opacity-60
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {props.children}
    </button>
  );
}
