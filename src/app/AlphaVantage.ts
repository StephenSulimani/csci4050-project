class AlphaVantage {
    api_keys: string[];
    base_url: string = "https://www.alphavantage.co/query?function="
    constructor(api_keys: string[]) {
        this.api_keys = api_keys;
    }

    get api_key() {
        return this.api_keys[Math.floor(Math.random() * this.api_keys.length)];
    }

    private call(url: string) {
        return fetch(this.base_url + url + "&apikey=" + this.api_key);
    }

    async daily_time_series(ticker: string) {
        const response = await this.call("TIME_SERIES_DAILY&symbol=" + ticker);
        const data = await response.json();
        return data;
    }

}

const api_keys = process.env.ALPHAVANTAGE_API_KEYS!.split(',');

const AlphaV = new AlphaVantage(api_keys);

export default AlphaV;
