export interface ITariffEntity {
    limit: number;
    price: number;
    tariff: string;
}

export class TariffEntity implements ITariffEntity {
    limit: number = 0;
    price: number = 0;
    tariff: string = '';
}