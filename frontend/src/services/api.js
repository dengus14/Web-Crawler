import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

/**
 * Start a new crawl job
 * @param {string} url - The URL to crawl
 * @returns {Promise} Response with jobId
 */
export const startCrawl = async (url) => {
  const response = await api.post(`/crawl?url=${encodeURIComponent(url)}`);
  return response.data;
};

/**
 * Get crawl job status
 * @param {string} jobId - The ID of the crawl job
 * @returns {Promise} Response with status and pagesCrawled
 */
export const getCrawlStatus = async (jobId) => {
  const response = await api.get(`/crawl/${jobId}/status`);
  return response.data;
};

/**
 * Get crawl job health report
 * @param {string} jobId - The ID of the crawl job
 * @returns {Promise} Response with broken links, slow pages, SEO issues, duplicates
 */
export const getCrawlReport = async (jobId) => {
  const response = await api.get(`/crawl/${jobId}/report`);
  return response.data;
};

/**
 * Get crawl job graph data
 * @param {string} jobId - The ID of the crawl job
 * @returns {Promise} Response with graph nodes and links
 */
export const getCrawlGraph = async (jobId) => {
  const response = await api.get(`/crawl/${jobId}/graph`);
  return response.data;
};

export default api;
