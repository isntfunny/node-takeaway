import {Takeaway} from '../api';

import {Model, BaseModel} from './Model';

@Model
export class Address extends BaseModel {
    static relationships = [];

    constructor(takeaway: Takeaway, data) {
        super(takeaway, data);
    }
}
