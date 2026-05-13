export default function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton" style={{ aspectRatio: '4/5' }} />
      <div style={{ padding: '10px 14px' }}>
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
      </div>
    </div>
  );
}
