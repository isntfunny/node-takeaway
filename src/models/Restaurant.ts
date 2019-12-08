import {Takeaway} from '../api';

import {Model, BaseModel, Data} from './Model';
import Country from './Country';
import {Address} from './Address';
import {Category} from './Category';
import {Review} from './Review';
import {Bank} from './Bank';

interface Time {
    currentTime?: Date;
    td?: {
        time?: {
            start?: Date;
            end?: Date;
        };
    };
    tm?: {
        time?: {
            start?: Date;
            end?: Date;
        };
    };
}

@Model
export class Restaurant extends BaseModel {
    static relationships = ['country', 'address', 'categories', 'banks'];

    id?: string;
    name?: string;
    tip?: boolean;
    new?: boolean;
    open?: boolean;
    branch?: string;
    payments?: {
        methods?: Array<{
            id?: string;
            fixedCosts?: number;
            percentageCosts?: string;
        }>;
    };
    estimatedDeliveryTime?: string;
    polygonStatus?: string;
    deliveryMethods?: {
        orderMethods?: string;
        delivery?: {
            open?: boolean;
            orderAhead?: boolean;
            mealPrepTime?: number;
        };
        pickup?: {
            open?: boolean;
            orderAhead?: boolean;
            mealPrepTime?: number;
        };
    };
    deliveryCosts?: {
        minimumAmount?: number;
        costs?: {
            from?: number;
            to?: number;
            costs?: number;
        };
    };
    deliveryDistricts?: {
        areas?: Array<{
            postalCode?: string[];
            minimumAmount?: number;
            costs?: {
                from?: number;
                to?: number;
                costs?: number;
            };
        }>;
    };
    kitchens?: {
        ids: string[];
    };
    subKitchens?: {
        ids: string[];
    };
    popularDishes?: {
        ids: string[];
    };
    sorting?: {
        s1?: string;
        s2?: string;
        s3?: string;
        s4?: string;
        s5?: string;
        s6?: string;
        s7?: string;
        s8?: string;
        s9?: string;
    };
    information?: string;
    grade?: number;
    ratingCount?: number;
    logoUrl?: string;
    headerImageUrl?: string;
    cacheKey?: string;
    hasDiscounts?: boolean;
    hasFoodTracker?: boolean;
    distance?: number;
    legal?: {
        owner?: string;
        commericalRegister?: string;
        chamberOfCommerce?: string;
        vat?: string;
        address?: {
            street?: string;
            number?: string;
            postalCode?: string;
            city?: string;
        };
    };
    deliveryTime?: Time;
    pickupTime?: Time;
    country: Country;
    address: Address;
    categories: Category[];
    banks: Bank[];

    constructor(takeaway: Takeaway, data: Data, country: Country) {
        super(takeaway, data);
        this.country = country;

        this.address = new Address(takeaway, data.address);
        delete data.address;
    }

    async getMenu(postalCode: string) {
        const data = await this.takeaway.getClient().getMenuCard({
            restaurantId: this.id,
            country: this.country.code,
            postalCode,
            latitude: this.address.latitude,
            longitude: this.address.longitude
        });
        this.data = Object.assign({}, this.data, data.restaurant);

        if (this.data.menu && this.data.menu.length > 0) {
            this.categories = this.data.menu[0].categories.categories.map((category: any) => new Category(this.takeaway, category));
            delete this.data.menu[0].categories;
            return this.categories;
        } else {
            return [];
        }
    }

    async getReviews(page = 1) {
        const data = await this.takeaway.getClient().getReviews({
            restaurantId: this.id,
            page
        });

        return data.reviews.reviews.map((review: any) => new Review(this.takeaway, review));
    }

    async getTime(orderMode: string) {
        const data = await this.takeaway.getClient().getServerTime({
            country: this.country.code,
            restaurantId: this.id,
            orderMode
        });

        this.open = data.time.open;
        return data.time;
    }

    async getBanks() {
        const data = await this.takeaway.getClient().getBanks({
            restaurantId: this.id
        });

        this.banks = data.banks.banks.map((bank: any) => new Bank(this.takeaway, bank));
        return this.banks;
    }
}

export default Restaurant;
