function StatCard({ label, value, valueColor, sublabel }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-1"
      style={{ backgroundColor: '#1B2336', border: '1px solid #2D3A52' }}
    >
      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
        {label}
      </p>
      <p
        className="text-3xl font-semibold font-mono leading-none"
        style={{ color: valueColor ?? '#F1F5F9' }}
      >
        {value}
      </p>
      {sublabel && (
        <p className="text-xs" style={{ color: '#64748B' }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

export default StatCard;
