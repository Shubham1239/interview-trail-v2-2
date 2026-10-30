import axiosClient from './axios';

function unwrap(response) {
  return response.data;
}

export function fetchComments(postId) {
  return axiosClient.get(`/posts/${postId}/comments`).then(unwrap);
}

export function createComment(postId, payload) {
  return axiosClient.post(`/posts/${postId}/comments`, payload).then(unwrap);
}

export function deleteComment(postId, commentId) {
  return axiosClient.delete(`/posts/${postId}/comments/${commentId}`).then(unwrap);
}
