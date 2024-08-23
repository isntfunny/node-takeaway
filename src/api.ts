import {TakeawayClient} from './client';
import {TakeawayConfig} from './config';
import {Country} from './models';

export class Takeaway {
    client: TakeawayClient;

    constructor(client?: TakeawayConfig | TakeawayClient) {
        if (client instanceof TakeawayConfig) {
            this.client = new TakeawayClient(client);
        } else if (client instanceof TakeawayClient) {
            this.client = client;
        } else {
            this.client = new TakeawayClient(client);
        }
    }

    getClient() {
        return this.client;
    }

    getConfig() {
        return this.getClient().config;
    }

    getLanguage() {
        return this.getConfig().language;
    }

    async getCountries(): Promise<Country[]> {
        const data = await this.getClient().getCountries();
        return data.config.countries.map((country: any) => new Country(this, country));
    }

    async getCountryById(id: string): Promise<Country> {
        const countries = await this.getCountries();
        return countries.filter((country: any) => country.id === id)[0];
    }
}
