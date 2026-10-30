import axiosClient from './axios';

function unwrap(response) {
  return response.data;
}

export function fetchPosts(options) {
  const opts = options || {};
  const page = opts.page || 1;
  const pageSize = opts.pageSize || 10;
  const searchTerm = opts.searchTerm || '';
  const tags = opts.tags || [];
  const sortBy = opts.sortBy || 'recent';
  const company = opts.company;

  return axiosClient
    .get('/posts', {
      params: {
        page,
        pageSize,
        q: searchTerm || undefined,
        tags: tags.join(',') || undefined,
        sortBy,
        company: company || undefined,
      },
    })
    .then(unwrap); // { items, page, totalPages, totalCount }
}

export function fetchPostById(postId) {
  return axiosClient.get(`/posts/${postId}`).then(unwrap);
}

export function createPost(payload) {
  return axiosClient.post('/posts', payload).then(unwrap);
}

export function updatePost(postId, payload) {
  return axiosClient.put(`/posts/${postId}`, payload).then(unwrap);
}

export function deletePost(postId) {
  return axiosClient.delete(`/posts/${postId}`).then(unwrap);
}

export function votePost(postId, direction) {
  return axiosClient.post(`/posts/${postId}/vote`, { direction }).then(unwrap);
}
