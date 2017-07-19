import { Injectable, Inject } from "@angular/core";
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EventModel } from '../events/model/event.model'; 
import { ProductEntity, ProductEntityRaw } from './entity/product.entity';
import { TariffEntity } from './entity/tariff.entity';

@Injectable()
export class OrderDialogService {
    
    constructor(@Inject('APP_CONFIG') private config, private http: Http) {}
    
    getTariffs(eventId: number) {
        return this.http.get(`${this.config.apiUrl}/${eventId}/ticket/bundle`).map(response => <TariffEntity[]> response.json());
    }
    
    getEvent(eventId: number) {
        return this.http.get(`${this.config.apiUrl}/${eventId}`).map(response => <EventModel> response.json());
    }
    
    getPreset(eventId: number) {
        return this.http.get(`${this.config.apiUrl}/${eventId}/coupon/bundle`).map(response => <ProductEntityRaw[]> response.json());
    }
    
    composeProducts(eventId: number) {
        return Observable.zip(
            this.getPreset(eventId),
            this.getEvent(eventId),
            function(presets, event) {
                let output = [];
                for (let product of event.products) {
                    for (let preset of presets) {
                        if (preset.productId == product.productId) {
                            output.push(new ProductEntity(product.name, preset.limit, preset.price, preset.productId));
                        }
                    }
                }
                if (output.length) {
                    return output;                            
                } else {
                    return null;
                }
            }
        );
    }
    
}