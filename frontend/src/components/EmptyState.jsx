function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 mb-4"
        style={{ color: '#2D3A52' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>
        {title}
      </p>
      {description && (
        <p className="text-xs mt-1 max-w-xs" style={{ color: '#64748B' }}>
          {description}
        </p>
      )}
    </div>
  );
}

export default EmptyState;
