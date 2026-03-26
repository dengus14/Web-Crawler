import { Link, useMatch } from 'react-router-dom';

function NavBar() {
  const statusMatch = useMatch('/status/:id');
  const reportMatch = useMatch('/report/:id');

  const jobId = statusMatch?.params?.id || reportMatch?.params?.id;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6"
      style={{
        height: '52px',
        backgroundColor: '#0F172A',
        borderBottom: '1px solid #2D3A52',
      }}
    >
      <Link
        to="/"
        className="font-mono text-sm font-semibold text-slate-200 hover:text-white transition-colors tracking-tight"
      >
        WebCrawler
      </Link>

      {jobId && (
        <div className="flex items-stretch gap-0 ml-auto h-full">
          <NavTab to={`/status/${jobId}`} active={!!statusMatch}>
            Status
          </NavTab>
          <NavTab to={`/report/${jobId}`} active={!!reportMatch}>
            Report
          </NavTab>
        </div>
      )}
    </nav>
  );
}

function NavTab({ to, active, children }) {
  return (
    <Link
      to={to}
      className="flex items-center px-4 text-sm transition-colors"
      style={{
        color: active ? '#F1F5F9' : '#64748B',
        borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = '#94A3B8';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = '#64748B';
      }}
    >
      {children}
    </Link>
  );
}

export default NavBar;
