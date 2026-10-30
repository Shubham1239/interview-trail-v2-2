export default function Input(props) {
  const error = props.error;
  const className = props.className || '';

  return (
    <label htmlFor={props.id} className="block">
      {props.label && <span className="mb-1 block text-sm font-medium text-ink-800">{props.label}</span>}
      <input
        id={props.id}
        type={props.type || 'text'}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        required={props.required}
        className={`w-full rounded-md border px-3 py-2 text-sm text-ink-900 outline-none
          transition-colors placeholder:text-ink-300
          ${error ? 'border-brick focus:border-brick' : 'border-ink-900/15 focus:border-trailmark-dark'}
          ${className}`}
      />
      {error && <span className="mt-1 block text-sm text-brick">{error}</span>}
    </label>
  );
}
