import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { fetchPostById, createPost, updatePost } from '../api/posts';
import useToast from '../hooks/useToast';
import { postDetailPath } from '../routes';

const EMPTY_FORM = { title: '', company: '', tags: '', body: '' };

/** Used for both /posts/new and /posts/:postId/edit — the only
 * difference between the two is whether postId is present. */
export default function PostFormPage() {
  const params = useParams();
  const postId = params.postId;
  const isEdit = Boolean(postId);
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(
    function loadExistingPost() {
      if (!isEdit) return;
      fetchPostById(postId).then(function onLoaded(post) {
        setForm({
          title: post.title,
          company: post.company || '',
          tags: (post.tags || []).join(', '),
          body: post.body,
        });
        setLoading(false);
      });
    },
    [isEdit, postId]
  );

  function updateField(name) {
    return function onChange(e) {
      const value = e.target.value;
      setForm(function apply(f) {
        return { ...f, [name]: value };
      });
    };
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Give it a title.';
    if (!form.body.trim() || form.body.trim().length < 30) next.body = 'Share at least a few sentences.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      company: form.company.trim() || undefined,
      tags: form.tags
        .split(',')
        .map(function trimTag(t) {
          return t.trim();
        })
        .filter(Boolean),
      body: form.body.trim(),
    };
    try {
      const saved = isEdit ? await updatePost(postId, payload) : await createPost(payload);
      showToast(isEdit ? 'Post updated.' : 'Post published.', 'success');
      navigate(postDetailPath(saved.id));
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold">
        {isEdit ? 'Edit experience' : 'Share an interview experience'}
      </h1>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="title"
            label="Title"
            value={form.title}
            onChange={updateField('title')}
            error={errors.title}
            placeholder="e.g. Backend SDE-1 onsite at Acme Corp"
          />
          <Input
            id="company"
            label="Company (optional)"
            value={form.company}
            onChange={updateField('company')}
          />
          <Input
            id="tags"
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={updateField('tags')}
            placeholder="dsa, system-design, onsite"
          />
          <label htmlFor="body" className="block">
            <span className="mb-1 block text-sm font-medium text-ink-800">What happened</span>
            <textarea
              id="body"
              rows={10}
              value={form.body}
              onChange={updateField('body')}
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none
                ${errors.body ? 'border-brick' : 'border-ink-900/15 focus:border-trailmark-dark'}`}
              placeholder="Rounds, questions asked, what went well, what you'd do differently…"
            />
            {errors.body && <span className="mt-1 block text-sm text-brick">{errors.body}</span>}
          </label>
          <Button type="submit" variant="accent" loading={submitting} className="self-start">
            {isEdit ? 'Save changes' : 'Publish'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
