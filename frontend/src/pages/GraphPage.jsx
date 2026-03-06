import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Graph3D from '../components/Graph3D';
import { getCrawlGraph } from '../services/api';

function GraphPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawGraphData, setRawGraphData] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const data = await getCrawlGraph(id);
        setRawGraphData(data);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [id]);

  // Process graph data: deduplicate links and filter self-links
  const processedGraphData = useMemo(() => {
    if (!rawGraphData) return { nodes: [], links: [] };

    const { nodes, links } = rawGraphData;

    // Deduplicate links and filter self-links
    const linkSet = new Set();
    const uniqueLinks = [];

    links.forEach((link) => {
      // Skip self-links
      if (link.source === link.target) return;

      // Create a unique key for the link
      const linkKey = `${link.source}->${link.target}`;

      if (!linkSet.has(linkKey)) {
        linkSet.add(linkKey);
        uniqueLinks.push(link);
      }
    });

    return {
      nodes,
      links: uniqueLinks,
    };
  }, [rawGraphData]);

  // Get root URL from first node
  const rootUrl = processedGraphData.nodes.length > 0 ? processedGraphData.nodes[0].id : '';

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p
            className="text-gray-400 text-lg"
            style={{ fontFamily: '"Space Grotesk", "Inter", sans-serif' }}
          >
            Loading graph data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
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
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D Graph */}
      <Graph3D graphData={processedGraphData} />

      {/* Back Button - Top Left */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-all duration-300 flex items-center gap-2 z-10"
        style={{
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      {/* Info Overlay Panel - Top Left (below Back button) */}
      <div
        className="absolute top-20 left-4 bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 z-10 max-w-sm"
        style={{
          fontFamily: '"Space Grotesk", "Inter", sans-serif',
        }}
      >
        <h3 className="text-white font-semibold text-lg mb-3">Graph Overview</h3>

        {/* Root URL */}
        <div className="mb-3">
          <p className="text-gray-400 text-xs mb-1">Crawled URL</p>
          <p className="text-white text-sm break-all">{rootUrl}</p>
        </div>

        {/* Stats */}
        <div className="mb-3">
          <p className="text-gray-400 text-xs mb-1">Total Nodes</p>
          <p className="text-white text-2xl font-bold">{processedGraphData.nodes.length}</p>
        </div>

        {/* Color Legend */}
        <div>
          <p className="text-gray-400 text-xs mb-2">Status Codes</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#22c55e' }}
              ></div>
              <span className="text-gray-300 text-sm">2xx - Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#eab308' }}
              ></div>
              <span className="text-gray-300 text-sm">3xx - Redirect</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#ef4444' }}
              ></div>
              <span className="text-gray-300 text-sm">4xx/5xx - Error</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: '#6b7280' }}
              ></div>
              <span className="text-gray-300 text-sm">Other</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphPage;
