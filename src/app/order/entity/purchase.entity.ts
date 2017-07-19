import { TicketEntity } from './ticket.entity';
import { CouponEntity } from './coupon.entity';
import { UserEntity } from './user.entity';

export interface IPurchaseEntity {
    tariffs: TicketEntity[];
    coupons: CouponEntity[];
    personal: UserEntity;
}

export class PurchaseEntity implements IPurchaseEntity {
    tariffs: TicketEntity[] = [];
    coupons: CouponEntity[];
    personal: UserEntity;
}