import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import ReportPage from './pages/ReportPage';
import GraphPage from './pages/GraphPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/status/:id" element={<StatusPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/graph/:id" element={<GraphPage />} />
      </Routes>
    </Router>
  );
}

export default App;
