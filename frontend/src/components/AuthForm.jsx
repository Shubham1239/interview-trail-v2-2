import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

/** Shared shell for the login and register pages — they only differ in
 * which fields they pass and what happens on submit. */
export default function AuthForm(props) {
  const fields = props.fields;
  const [values, setValues] = useState(function initValues() {
    const initial = {};
    fields.forEach(function setEmpty(f) {
      initial[f.name] = '';
    });
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(name) {
    return function onChange(e) {
      const value = e.target.value;
      setValues(function updateValue(v) {
        return { ...v, [name]: value };
      });
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await props.onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map(function renderField(f) {
        return (
          <Input
            key={f.name}
            id={f.name}
            label={f.label}
            type={f.type || 'text'}
            value={values[f.name]}
            onChange={handleChange(f.name)}
            required
          />
        );
      })}
      {props.error && <p className="text-sm text-brick">{props.error}</p>}
      <Button type="submit" variant="accent" loading={submitting} className="mt-2">
        {props.submitLabel}
      </Button>
    </form>
  );
}
