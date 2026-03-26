import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import ReportPage from './pages/ReportPage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/status/:id" element={<StatusPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
