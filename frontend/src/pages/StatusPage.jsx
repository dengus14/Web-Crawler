import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NetworkBackground from '../components/NetworkBackground';
import StatusCard from '../components/StatusCard';
import { getCrawlStatus } from '../services/api';

function StatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('PENDING');
  const [pagesCrawled, setPagesCrawled] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let pollInterval;

    const fetchStatus = async () => {
      try {
        const response = await getCrawlStatus(id);
        setStatus(response.status);
        setPagesCrawled(response.pagesCrawled);

        // If completed, redirect after delay
        if (response.status === 'DONE' || response.status === 'COMPLETED') {
          setTimeout(() => {
            navigate(`/graph/${id}`);
          }, 1500);
        }

        // If failed, stop polling
        if (response.status === 'FAILED') {
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error fetching status:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch crawl status');
        clearInterval(pollInterval);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 2 seconds
    pollInterval = setInterval(fetchStatus, 2000);

    // Cleanup on unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
            style={{
              fontFamily: '"Space Grotesk", monospace',
              letterSpacing: '-0.02em',
            }}
          >
            Crawl Status
          </h1>
          <p
            className="text-gray-500 text-sm mt-2"
            style={{
              fontFamily: '"Space Grotesk", "Inter", sans-serif',
            }}
          >
            Job ID: {id}
          </p>
        </div>

        {/* Status Card or Error */}
        {error ? (
          <div className="text-center max-w-md">
            <div className="mb-6 p-6 bg-red-900/30 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-start gap-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-400 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-left">
                  <h3 className="text-red-300 font-semibold mb-1">Error</h3>
                  <p className="text-red-300/80 text-sm">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              style={{
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
              }}
            >
              Go Back
            </button>
          </div>
        ) : status === 'FAILED' ? (
          <div className="text-center max-w-md">
            <StatusCard status={status} pagesCrawled={pagesCrawled} />
            <button
              onClick={handleGoBack}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              style={{
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
              }}
            >
              Go Back
            </button>
          </div>
        ) : (
          <StatusCard status={status} pagesCrawled={pagesCrawled} />
        )}
      </div>
    </div>
  );
}

export default StatusPage;
