import  { useEffect, useRef } from 'react';
import { TokenInfo } from '../../types/token';
import { createChart, IChartApi } from 'lightweight-charts';
import { BondingCurveCalculator } from '../../utils/bondingCurve';

interface PriceChartProps {
  tokenInfo: TokenInfo;
}

export default function PriceChart({ tokenInfo }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const calculator = new BondingCurveCalculator(tokenInfo.curveType);
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const series = chart.addAreaSeries({
      lineColor: '#4F46E5',
      topColor: '#4F46E580',
      bottomColor: '#4F46E510',
    });

    // Generate price data points
    const data = [];
    const currentSupply = BigInt(tokenInfo.totalSupply);
    const step = currentSupply / BigInt(100);
    
    for (let i = BigInt(0); i <= currentSupply; i += step) {
      const price = Number(calculator.getCurrentPrice(i)) / 1e18;
      data.push({
        time: Number(i),
        value: price,
      });
    }
    // @ts-ignore
    series.setData(data);
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [tokenInfo]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Price Chart</h2>
        <div className="text-sm text-gray-500">
          Total Supply: {tokenInfo.totalSupply.toLocaleString()}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold mb-2">
          Understanding {tokenInfo.curveType.charAt(0).toUpperCase() + tokenInfo.curveType.slice(1)} Bonding Curve
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Price Impact</h4>
            <p className="text-sm text-gray-600">
              Larger trades will have a higher price impact due to the bonding curve mechanics
            </p>
          </div>
          <div>
            <h4 className="font-medium">Market Dynamics</h4>
            <p className="text-sm text-gray-600">
              Price adjusts automatically based on token supply following the {tokenInfo.curveType} curve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}