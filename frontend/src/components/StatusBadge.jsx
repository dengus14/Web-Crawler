const STYLES = {
  RUNNING:   { bg: '#1E3A5F', color: '#60A5FA', dot: '#3B82F6', label: 'RUNNING',  pulse: true  },
  PENDING:   { bg: '#1E3A5F', color: '#60A5FA', dot: '#3B82F6', label: 'PENDING',  pulse: true  },
  DONE:      { bg: '#052E16', color: '#4ADE80', dot: '#22C55E', label: 'DONE',     pulse: false },
  COMPLETED: { bg: '#052E16', color: '#4ADE80', dot: '#22C55E', label: 'DONE',     pulse: false },
  FAILED:    { bg: '#1F0A0A', color: '#F87171', dot: '#EF4444', label: 'FAILED',   pulse: false },
};

function StatusBadge({ status }) {
  const s = STYLES[status] ?? STYLES.PENDING;
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider font-mono"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${s.pulse ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: s.dot }}
      />
      {s.label}
    </span>
  );
}

export default StatusBadge;
