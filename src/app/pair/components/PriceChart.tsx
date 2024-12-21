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
        
        // Sort swaps by timestamp
        const sortedSwaps = [...swaps].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        // Get start and end times
        const startTime = new Date(sortedSwaps[0].createdAt);
        const endTime = new Date(sortedSwaps[sortedSwaps.length - 1].createdAt);
        
        // Create array of all possible timestamps
        const timestamps: number[] = [];
        const currentTime = new Date(startTime);
        currentTime.setMinutes(Math.floor(currentTime.getMinutes() / intervalMinutes) * intervalMinutes);
        currentTime.setSeconds(0);
        currentTime.setMilliseconds(0);

        while (currentTime <= endTime) {
            timestamps.push(currentTime.getTime());
            currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        }

        // Initialize candleData with all timestamps
        const candleData: CandleData = {};
        let lastKnownPrice = formatLamports(sortedSwaps[0].startPrice * solPrice); // Initialize with first price

        timestamps.forEach(timestamp => {
            candleData[timestamp.toString()] = {
                open: lastKnownPrice,
                high: lastKnownPrice,
                low: lastKnownPrice,
                close: lastKnownPrice,
                volume: 0
            };
        });

        // Process swaps
        sortedSwaps.forEach(swap => {
            const timestamp = new Date(swap.createdAt);
            timestamp.setMinutes(Math.floor(timestamp.getMinutes() / intervalMinutes) * intervalMinutes);
            timestamp.setSeconds(0);
            timestamp.setMilliseconds(0);
            
            const timeKey = timestamp.getTime().toString();
            const startPriceUSD = formatLamports(swap.startPrice * solPrice);
            const endPriceUSD = formatLamports(swap.endPrice * solPrice);

            if (candleData[timeKey].volume === 0) {
                candleData[timeKey].open = startPriceUSD;
                candleData[timeKey].high = Math.max(startPriceUSD, endPriceUSD);
                candleData[timeKey].low = Math.min(startPriceUSD, endPriceUSD);
                candleData[timeKey].close = endPriceUSD;
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
                candleData[timeKey].close = endPriceUSD;
            }
            candleData[timeKey].volume += swap.isBuy ? swap.amountOut : swap.amountIn;
            lastKnownPrice = endPriceUSD; // Update last known price
        });

        // For any remaining empty intervals after the last trade, use the last known price
        timestamps.forEach(timestamp => {
            const timeKey = timestamp.toString();
            if (candleData[timeKey].volume === 0) {
                candleData[timeKey].open = lastKnownPrice;
                candleData[timeKey].high = lastKnownPrice;
                candleData[timeKey].low = lastKnownPrice;
                candleData[timeKey].close = lastKnownPrice;
            }
        });

        // Convert to final format
        const processedData = timestamps.map(timestamp => ({
            time: (timestamp / 1000) as UTCTimestamp,
            open: candleData[timestamp.toString()].open,
            high: candleData[timestamp.toString()].high,
            low: candleData[timestamp.toString()].low,
            close: candleData[timestamp.toString()].close
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