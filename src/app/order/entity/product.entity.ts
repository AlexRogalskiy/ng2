export interface IProductEntity {
    name: string;
    limit: number;
    price: number;
    productId: number;
}

export class ProductEntity implements IProductEntity {
    name: string;
    limit: number;
    price: number;
    productId: number;

    constructor(
            name: string,
            limit: number,
            price: number,
            productId: number) {
        this.name = name;
        this.limit = limit;
        this.price = price;
        this.productId = productId;
    }
}

export interface IProductEntityRaw {
    limit: number;
    price: number;
    productId: number;
}

export class ProductEntityRaw {
    limit: number;
    price: number;
    productId: number;
}