import Order from '@/db/models/Order';
import Portfolio from '@/db/models/Portfolio';
import User from '@/db/models/User';

export interface IFinnhubQuote {
    c: number; // Current price
    d: number; // Change
    dp: number; // Change percent
    h: number; // High
    l: number; // Low
    o: number; // Open
    pc: number; // Previous close
    t: number; // Timestamp
}

function isFinnhubQuote(obj: unknown): obj is IFinnhubQuote {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    const quote = obj as IFinnhubQuote;

    return typeof quote.c === 'number'
        && typeof quote.d === 'number'
        && typeof quote.dp === 'number'
        && typeof quote.h === 'number'
        && typeof quote.l === 'number'
        && typeof quote.o === 'number'
        && typeof quote.pc === 'number'
        && typeof quote.t === 'number';
}

export class FinnhubUtils {
    static async getPrice(ticker: string): Promise<number> {
        const apiKey = process.env.FINNHUB_API_KEY;
        const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            if (!isFinnhubQuote(data)) {
                throw new Error("Unexpected response format")
            }

            return data.c;
        } catch (error) {
            console.error('Error fetching price:', error);
            throw new Error('Error fetching price');
        }
    }
    static async calcCash(portfolio_id: string): Promise<number> {
        const portfolio = await Portfolio.findOne({
            where: { id: portfolio_id }
        })

        if (!portfolio) {
            throw new Error("Portfolio not found");
        }

        const orders = await Order.findAll({
            where: { portfolio_id: portfolio_id }
        });

        let cash = portfolio.dataValues.startingCapital;
        for (let order of orders) {
            order = order.dataValues;
            if (order.type === 'BUY') {
                cash -= order.price * order.amount;
            } else if (order.type === 'SELL') {
                cash += order.price * order.amount;
            }
        }

        return cash;
    }

}
