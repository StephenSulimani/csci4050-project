import fetchCookie from "fetch-cookie";

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
        let key = '';

        while (key.length == 0 || !key) {
            key = this.api_keys[Math.floor(Math.random() * this.api_keys.length)];
        }
        return key;
    }

    async new_api_key() {
        const session = fetchCookie(fetch);
        const res = await session("https://www.alphavantage.co/support/#api-key",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': 'https://www.alphavantage.co/support/',
                    'X-Real-IP': this.random_ip,
                    'X-Forwarded-For': this.random_ip
                },
            });
        const cookies = res.headers.get('set-cookie');
        const csrf_regex = /csrftoken=(.*?);/gm;
        const csrf = csrf_regex.exec(cookies!)[1];
        const random_email = Math.floor(Math.random() * 1000000) + "@gmail.com";
        const random_organization_name = Math.floor(Math.random() * 1000000)
        const response = await session('https://www.alphavantage.co/create_post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': 'https://www.alphavantage.co/support/',
                'X-Real-IP': this.random_ip,
                'X-Forwarded-For': this.random_ip,
                'Cookie': cookies!,
                'X-CSRFToken': csrf
            },
            body: `first_text=deprecated&last_text=deprecated&occupation_text=Investor&organization_text=${random_organization_name}&email_text=${random_email}`
        })

        const data = await response.json();

        const text = data.text;

        const regex = /key\sis:(.*?)\./gm;
        const match = regex.exec(text);

        if (match) {
            return match[1].replace(" ", "");
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
        const key = await this.new_api_key();
        console.log(key)
        this.api_keys.push(key)
        const response = await this.call("TIME_SERIES_DAILY&symbol=" + ticker);
        const data = await response.json();
        return data;
    }

}

const api_keys = process.env.ALPHAVANTAGE_API_KEYS ? process.env.ALPHAVANTAGE_API_KEYS.split(',') : [];

const AlphaV = new AlphaVantage(api_keys);

export default AlphaV;
