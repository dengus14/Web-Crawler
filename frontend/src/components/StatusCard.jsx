import { useEffect, useState } from 'react';

function StatusCard({ status, pagesCrawled }) {
  const [displayCount, setDisplayCount] = useState(0);

  // Animate the counter
  useEffect(() => {
    if (displayCount < pagesCrawled) {
      const increment = Math.ceil((pagesCrawled - displayCount) / 10);
      const timer = setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + increment, pagesCrawled));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayCount, pagesCrawled]);

  const getStatusBadge = () => {
    if (status === 'RUNNING' || status === 'PENDING') {
      return (
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 border-2 border-blue-400 rounded-full backdrop-blur-sm">
          <div
            className="w-3 h-3 bg-blue-400 rounded-full"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
            }}
          />
          <span className="text-blue-300 font-semibold text-lg tracking-wide">
            CRAWLING
          </span>
        </div>
      );
    }

    if (status === 'DONE' || status === 'COMPLETED') {
      return (
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border-2 border-green-400 rounded-full backdrop-blur-sm">
          <div
            className="w-3 h-3 bg-green-400 rounded-full"
            style={{
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
            }}
          />
          <span className="text-green-300 font-semibold text-lg tracking-wide">
            COMPLETE
          </span>
        </div>
      );
    }

    if (status === 'FAILED') {
      return (
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 border-2 border-red-400 rounded-full backdrop-blur-sm">
          <div
            className="w-3 h-3 bg-red-400 rounded-full"
            style={{
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
            }}
          />
          <span className="text-red-300 font-semibold text-lg tracking-wide">
            FAILED
          </span>
        </div>
      );
    }

    return null;
  };

  const getSubtext = () => {
    if (status === 'RUNNING' || status === 'PENDING') {
      return 'Analyzing links and building graph...';
    }
    if (status === 'DONE' || status === 'COMPLETED') {
      return 'Redirecting to results...';
    }
    if (status === 'FAILED') {
      return 'Crawl failed. Please try again.';
    }
    return '';
  };

  return (
    <div className="text-center">
      {/* Status Badge */}
      <div className="mb-8">
        {getStatusBadge()}
      </div>

      {/* Pages Crawled Counter */}
      <div className="mb-6">
        <div
          className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
          style={{
            fontFamily: '"Space Grotesk", monospace',
            letterSpacing: '-0.02em',
          }}
        >
          {displayCount}
        </div>
        <p
          className="text-gray-400 text-xl mt-4"
          style={{
            fontFamily: '"Space Grotesk", "Inter", sans-serif',
          }}
        >
          pages crawled
        </p>
      </div>

      {/* Subtext */}
      <p
        className="text-gray-500 text-lg"
        style={{
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
        }}
      >
        {getSubtext()}
      </p>
    </div>
  );
}

export default StatusCard;
