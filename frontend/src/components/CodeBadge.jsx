function CodeBadge({ code }) {
  const c = parseInt(code, 10);
  let bg, color;

  if (c >= 200 && c < 300)      { bg = '#052E16'; color = '#4ADE80'; }
  else if (c >= 300 && c < 400) { bg = '#431407'; color = '#FCD34D'; }
  else if (c >= 400 && c < 500) { bg = '#1F0A0A'; color = '#F87171'; }
  else if (c >= 500)             { bg = '#1F0A0A'; color = '#EF4444'; }
  else                           { bg = '#1E293B'; color = '#94A3B8'; }

  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      {code}
    </span>
  );
}

export default CodeBadge;
