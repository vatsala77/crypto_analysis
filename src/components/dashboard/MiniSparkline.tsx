import { useMemo } from 'react';

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

const MiniSparkline = ({ data, width = 120, height = 40, className }: MiniSparklineProps) => {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  }, [data, width, height]);

  const isPositive = data.length >= 2 && data[data.length - 1] >= data[0];
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
            stopOpacity={0.5}
          />
          <stop
            offset="100%"
            stopColor={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
            stopOpacity={1}
          />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MiniSparkline;
