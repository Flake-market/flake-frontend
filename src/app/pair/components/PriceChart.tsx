"use client"

import { createChart, ColorType, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { Swap } from '../types/SwapTypes';
import { formatLamports, solPrice } from '@/lib/utils';

interface ChartContainerProps {
    swaps: Swap[];
}

interface CandleData {
    [key: string]: {
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }
}

const PriceChart = ({ swaps }: ChartContainerProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    const processSwapsToCandles = (swaps: Swap[], intervalMinutes: number = 5) => {
        if (!swaps.length) return [];
        
        const candleData: CandleData = {};
        
        // Sort swaps by timestamp
        const sortedSwaps = [...swaps].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        sortedSwaps.forEach(swap => {
            const timestamp = new Date(swap.createdAt);
            timestamp.setMinutes(Math.floor(timestamp.getMinutes() / intervalMinutes) * intervalMinutes);
            timestamp.setSeconds(0);
            timestamp.setMilliseconds(0);
            
            const timeKey = timestamp.getTime().toString();
            
            // Convert startPrice and endPrice to final USD values
            // (Assuming solPrice is globally available or imported accordingly)
            const startPriceUSD = formatLamports(swap.startPrice * solPrice);
            const endPriceUSD   = formatLamports(swap.endPrice   * solPrice);

            // For each time segment, if it's the first swap,
            // set open to startPrice, close to endPrice
            // high is max of start/end, low is min of start/end.
            if (!candleData[timeKey]) {
                candleData[timeKey] = {
                    open:  startPriceUSD,
                    high:  Math.max(startPriceUSD, endPriceUSD),
                    low:   Math.min(startPriceUSD, endPriceUSD),
                    close: endPriceUSD,
                    volume: swap.isBuy ? swap.amountOut : swap.amountIn
                };
            } else {
                candleData[timeKey].high = Math.max(
                    candleData[timeKey].high, 
                    startPriceUSD, 
                    endPriceUSD
                );
                candleData[timeKey].low = Math.min(
                    candleData[timeKey].low, 
                    startPriceUSD, 
                    endPriceUSD
                );
                // Update close to the last swap's end price
                candleData[timeKey].close = endPriceUSD;
                candleData[timeKey].volume += swap.isBuy ? swap.amountOut : swap.amountIn;
            }
        });

        const processedData = Object.entries(candleData).map(([time, data]) => ({
            time: parseInt(time) / 1000 as UTCTimestamp,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close
        }));

        return processedData;
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#1E1E1E' },
                textColor: '#DDD',
            },
            grid: {
                vertLines: { color: '#333' },
                horzLines: { color: '#333' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                barSpacing: 12,
                rightOffset: 5,
                fixLeftEdge: true,
                fixRightEdge: true,
            },
        });

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            priceFormat: {
                type: 'price',
                precision: 5,
                minMove: 0.00001
            },
            baseLineVisible: true,
            lastValueVisible: true,
        });

        // Process and set data
        const candleData = processSwapsToCandles(swaps);
        if (candleData.length > 0) {
            candlestickSeries.setData(candleData);
            chart.timeScale().fitContent();
        }

        const handleResize = () => {
            if (chartContainerRef.current && chart) {
                chart.applyOptions({ 
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight
                });
            }
        };

        // Store refs for cleanup
        chartRef.current = chart;
        candlestickSeriesRef.current = candlestickSeries;

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [swaps]);

    return (
        <div 
            ref={chartContainerRef} 
            className="absolute inset-0"
            style={{ minHeight: '400px' }}
        />
    );
};

export default PriceChart; 