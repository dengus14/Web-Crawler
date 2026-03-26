import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const startCrawl = async (url) => {
  const response = await api.post(`/crawl?url=${encodeURIComponent(url)}`);
  return response.data;
};

export const getCrawlStatus = async (jobId) => {
  const response = await api.get(`/crawl/${jobId}/status`);
  return response.data;
};

export const getCrawlReport = async (jobId) => {
  const response = await api.get(`/crawl/${jobId}/report`);
  return response.data;
};

export default api;
