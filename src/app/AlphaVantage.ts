class AlphaVantage {
    api_keys: string[];
    base_url: string = "https://www.alphavantage.co/query?function="
    constructor(api_keys: string[]) {
        this.api_keys = api_keys;
    }

    get random_ip() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    }

    get api_key() {
        return this.api_keys[Math.floor(Math.random() * this.api_keys.length)];
    }

    async new_api_key() {
        const response = await fetch('https://www.alphavantage.co/create_post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': 'https://www.alphavantage.co/support/',
                'X-Real-IP': this.random_ip,
                'X-Forwarded-For': this.random_ip
            },
            body: `first_text=deprecated&last_text=deprecated&occupation_text=Investor&organization_text=ranadgajkg&email_text=gakngkjag%40gmail.co`
        })

        const data = await response.json();

        const text = data.text;

        const regex = /key\sis:(.*?)\./gm;
        const match = regex.exec(text);

        if (match) {
            return match[1];
        } else {
            return "";
        }

    }

    private call(url: string) {
        return fetch(this.base_url + url + "&apikey=" + this.api_key, {
            headers: {
                "X-Forwarded-For": this.random_ip,
                "X-Real-IP": this.random_ip
            }
        });
    }

    async daily_time_series(ticker: string) {
        const response = await this.call("TIME_SERIES_DAILY&symbol=" + ticker);
        const data = await response.json();
        return data;
    }

}

const api_keys = process.env.ALPHAVANTAGE_API_KEYS ? process.env.ALPHAVANTAGE_API_KEYS.split(',') : [];

const AlphaV = new AlphaVantage(api_keys);

export default AlphaV;
