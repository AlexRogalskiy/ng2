import { ProductEntity } from './product.entity';

export interface ICouponEntity {
    product: ProductEntity;
    quantity: number;
}

export class CouponEntity implements ICouponEntity {
    product: ProductEntity;
    quantity: number;
    
    constructor(product: ProductEntity, quantity: number) {
        this.product = product;
        this.quantity = quantity;
    }

}