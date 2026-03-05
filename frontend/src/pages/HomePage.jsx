import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkBackground from '../components/NetworkBackground';
import CrawlInput from '../components/CrawlInput';
import { startCrawl } from '../services/api';

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (url) => {
    setLoading(true);
    setError('');

    try {
      const response = await startCrawl(url);
      // Assuming the API returns an object with a jobId or id field
      const jobId = response.jobId || response.id || response;
      navigate(`/status/${jobId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to start crawl. Please check the URL and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1
            className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
            style={{
              fontFamily: '"Space Grotesk", "Orbitron", monospace',
              letterSpacing: '-0.02em',
            }}
          >
            WebCrawler
          </h1>
          <p
            className="text-gray-400 text-lg md:text-xl"
            style={{
              fontFamily: '"Space Grotesk", "Inter", sans-serif',
            }}
          >
            Explore the web, analyze connections, discover insights
          </p>
        </div>

        {/* Search Input */}
        <CrawlInput
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}>
            Crawls up to 100 pages • Analyzes links • Detects SEO issues
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
