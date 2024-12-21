export interface Swap {
    pairKey: string;
    user: string;
    isBuy: boolean;
    tokenIn: string;
    tokenOut: string;
    amountIn: number;
    amountOut: number;
    createdAt: string;
    averagePrice: number;
}