import { Component, ViewChild, Output, EventEmitter } from '@angular/core';

import { ProductEntity } from '../entity/product.entity';
import { CouponEntity } from '../entity/coupon.entity';

@Component({
    selector: 'order-products',
    templateUrl: 'products.component.html',
    styleUrls: ['products.component.css'],
})
export class OrderProducts {
    
    private products: ProductEntity[];
    private coupons: CouponEntity[];
    
    @Output() update = new EventEmitter<CouponEntity[]>();
    
    constructor() {}

    getProducts() {
        return this.products;
    }
    
    setPurchases(purchases: CouponEntity[]) {
        this.coupons = purchases;
        if (this.coupons && !this.coupons.length) { //Step selection fix
            this.coupons = null;
        }
    }
    
    setProducts(products: ProductEntity[]) {
        if (products == null || !products.length) {
            this.products = null;
        } else {
            this.products = [];
            if (products instanceof Array) {
                this.products = products;
            } else {
                this.products.push(products);
            }
        }
    }
    
    productsAvailible() {
        if (this.products) {
            if (this.coupons && this.coupons.length == this.products.length) {
                return false;
            }
            if (this.products.length) {
                return true;
            }
        }
        return false;
    }
    
    purchase(coupon: ProductEntity) {
        if (!this.coupons) {
            this.coupons = [];
        }
        this.coupons.push(new CouponEntity(coupon, 1));
        this.update.emit(this.coupons);
    }
    
    isPurchased(product: ProductEntity) {
        if (!this.coupons) {
            return false;
        }
        for (var coupon of this.coupons) {
            if (product === coupon.product) {
                return true;
            }
        }
        return false;
    }
    
    checkNull(coupon: CouponEntity) {
        if (isNaN(parseInt(''+coupon.quantity)) || !isFinite(coupon.quantity)) {
            this.setQuantity(coupon, 0);
        }
    }
    
    setQuantity(coupon: CouponEntity, newQuantityString) {
        let newQuantity = parseInt(''+newQuantityString); //In case to protect from uncertain user input
        if (isNaN(newQuantity) || !isFinite(newQuantity)) {
            coupon.quantity = null;
            return;
        }
        if (newQuantity == 0) {
            this.coupons.splice(this.coupons.indexOf(coupon), 1);
            if (this.coupons.length == 0) {
                this.coupons = null;
            }
        } else {
            let index = this.coupons.indexOf(coupon);
            if (index >= 0) {
                if (newQuantity > coupon.product.limit) {
                    newQuantity = coupon.product.limit;
                }
                this.coupons.find(it => it === coupon).quantity = newQuantity;
            }
        }
        this.update.emit(this.coupons);
    }
    
    getSummary() {
        var summary = 0;
        for (let coupon of this.coupons) {
            summary += coupon.quantity * coupon.product.price;
        }
        return summary;
    }
}