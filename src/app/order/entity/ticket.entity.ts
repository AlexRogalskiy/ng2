import { TariffEntity } from './tariff.entity';

export interface ITicketEntity {
    tariff: TariffEntity;
    quantity: number;
}

export class TicketEntity implements ITicketEntity {
    
    tariff: TariffEntity = new TariffEntity();
    quantity: number = 0;

    constructor(tariff: TariffEntity, quantity: number) {
        this.tariff = tariff;
        this.quantity = quantity;
    }

}