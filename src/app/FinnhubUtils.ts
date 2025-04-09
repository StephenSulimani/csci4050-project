import Order from '@/db/models/Order';
import User from '@/db/models/User';

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

            return data.c;
        } catch (error) {
            console.error('Error fetching price:', error);
            throw new Error('Error fetching price');
        }
    }

    static async calcCash(user_id: string): Promise<number> {
        const user = await User.findOne({
            where: { id: user_id }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const orders = await Order.findAll({
            where: { user_id: user_id }
        });

        let cash = user.dataValues.startingCapital;
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