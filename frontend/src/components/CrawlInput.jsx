import { useState } from 'react';

function CrawlInput({ onSubmit, loading, error }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !loading) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: '1px solid #2D3A52', backgroundColor: '#1B2336' }}
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={loading}
          required
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: '#F1F5F9' }}
          onFocus={(e) => {
            e.currentTarget.closest('div').style.borderColor = '#2563EB';
          }}
          onBlur={(e) => {
            e.currentTarget.closest('div').style.borderColor = '#2D3A52';
          }}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2563EB' }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1D4ED8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Starting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Crawl
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
    </form>
  );
}

export default CrawlInput;
