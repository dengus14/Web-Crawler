import { useParams } from 'react-router-dom';

function GraphPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Crawl Graph Visualization</h1>
        <p className="text-gray-400">GraphPage placeholder for job ID: {id}</p>
        <p className="text-gray-400 mt-2">Graph3D component will be added here</p>
      </div>
    </div>
  );
}

export default GraphPage;
