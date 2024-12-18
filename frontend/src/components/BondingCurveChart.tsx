

interface BondingCurveChartProps {
  curveType: 'linear' | 'exponential' | 'logarithmic' | 'sigmoid';
}

export default function BondingCurveChart({ curveType }: BondingCurveChartProps) {
  const getPoints = () => {
    const points = [];
    for (let x = 0; x <= 100; x += 5) {
      let y;
      switch (curveType) {
        case 'linear':
          y = x;
          break;
        case 'exponential':
          y = Math.pow(x / 10, 2);
          break;
        case 'logarithmic':
          y = Math.log(x + 1) * 20;
          break;
        case 'sigmoid':
          y = 100 / (1 + Math.exp(-0.1 * (x - 50)));
          break;
      }
      points.push(`${x},${100 - y}`);
    }
    return points.join(' ');
  };

  const getCurveDescription = () => {
    switch (curveType) {
      case 'linear':
        return "Linear curve provides a steady, predictable price increase. Good for stable, long-term growth.";
      case 'exponential':
        return "Exponential curve creates rapid price appreciation. Suitable for high-growth potential tokens.";
      case 'logarithmic':
        return "Logarithmic curve offers faster initial growth that stabilizes over time. Great for early adopter incentives.";
      case 'sigmoid':
        return "Sigmoid curve balances initial accessibility with later scarcity. Ideal for community-driven tokens.";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="aspect-[2/1] bg-gray-50 relative border rounded-lg">
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
          <polyline
            points={getPoints()}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
          />
          <line x1="0" y1="100" x2="100" y2="100" stroke="#94A3B8" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="100" stroke="#94A3B8" strokeWidth="1" />
        </svg>
        <div className="absolute bottom-2 right-4 text-sm text-gray-500">Supply</div>
        <div className="absolute top-2 left-2 text-sm text-gray-500 rotate-270">Price</div>
      </div>
      <p className="mt-4 text-sm text-gray-600">{getCurveDescription()}</p>
    </div>
  );
}