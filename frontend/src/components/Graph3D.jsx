import { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

function Graph3D({ graphData }) {
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get node color based on status code
  const getNodeColor = (node) => {
    const code = node.statusCode;
    if (code >= 200 && code < 300) return '#22c55e'; // green
    if (code >= 300 && code < 400) return '#eab308'; // yellow
    if (code >= 400) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  // Node hover tooltip
  const nodeLabel = (node) => {
    return `
      <div style="
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-family: 'Space Grotesk', monospace;
        max-width: 400px;
        word-wrap: break-word;
      ">
        <div style="font-weight: bold; margin-bottom: 8px; color: #60a5fa;">
          ${node.id}
        </div>
        <div style="font-size: 14px; color: #d1d5db;">
          <div style="margin-bottom: 4px;">
            <span style="color: #9ca3af;">Status:</span>
            <span style="color: ${getNodeColor(node)}; font-weight: 600;">
              ${node.statusCode}
            </span>
          </div>
          <div>
            <span style="color: #9ca3af;">Response time:</span>
            <span style="color: #60a5fa; font-weight: 600;">
              ${node.responseTimeMs}ms
            </span>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0a"
        nodeLabel={nodeLabel}
        nodeColor={getNodeColor}
        nodeVal={3}
        nodeRelSize={3}
        linkColor={() => 'rgba(100, 116, 139, 0.3)'}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleSpeed={0.003}
        linkDirectionalParticleColor={() => 'rgba(100, 200, 255, 0.5)'}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  );
}

export default Graph3D;
