interface MetricTileProps {
  label: string;
  value: string | number;
  accent?: 'primary' | 'success' | 'warning' | 'danger';
}

const MetricTile = ({ label, value, accent = 'primary' }: MetricTileProps) => {
  return (
    <div className={`metric metric--${accent}`}>
      <dt className="metric__label">{label}</dt>
      <dd className="metric__value">{value}</dd>
    </div>
  );
};

export default MetricTile;









