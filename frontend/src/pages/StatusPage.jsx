import { useParams } from 'react-router-dom';

function StatusPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Crawl Status</h1>
        <p className="text-gray-400">StatusPage placeholder for job ID: {id}</p>
        <p className="text-gray-400 mt-2">StatusCard component will be added here</p>
      </div>
    </div>
  );
}

export default StatusPage;
