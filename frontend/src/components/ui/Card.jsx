export default function Card(props) {
  const className = props.className || '';
  return (
    <div className={`rounded-lg border border-ink-900/10 bg-white/60 p-5 shadow-sm ${className}`}>
      {props.children}
    </div>
  );
}
