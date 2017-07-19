import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { PurchaseEntity } from './entity/purchase.entity';
import { TicketEntity } from './entity/ticket.entity';
import { TariffEntity } from './entity/tariff.entity';
import { ProductEntity } from './entity/product.entity';
import { CouponEntity } from './entity/coupon.entity';
import { UserEntity } from './entity/user.entity';
import { OrderDialogService } from './order-dialog.service';
import { OrderTariffs } from './tariffs/tariffs.component';
import { OrderProducts } from './products/products.component';
import { OrderPersonal } from './personal/personal.component';

@Component({
    selector: 'order-dialog',
    templateUrl: 'order-dialog.component.html',
    styleUrls: ['order-dialog.component.css'],
})
export class OrderDialog {
    
    @ViewChild('orderDialog') orderDialog: ModalComponent;
    @ViewChild(OrderTariffs) tariffStep;
    @ViewChild(OrderProducts) productStep;
    @ViewChild(OrderPersonal) personalStep;
    purchase: PurchaseEntity; 
    
    eventId: number;
    tariffsSave: TariffEntity[];
    productsSave: ProductEntity[];
    
    currentStep: number;
    stepContent: string[];
    stepsDone: boolean[];
    stepsDisabled: boolean[];
    
    constructor(private cdr: ChangeDetectorRef, private service: OrderDialogService) {}
    
    public open(eventId: number) {
        this.orderDialog.open();
        this.stepContent = ['Тарифы', 'Купоны', 'Личные данные', 'Платеж'];
        this.stepsDone = [false, false, false, false];
        this.stepsDisabled = [false, true, true, true];
        this.purchase = new PurchaseEntity();
        this.eventId = eventId;
        this.acquireTariffs();
        this.currentStep = 0;
    }
    
    checkSteps() {
        if (this.purchase) {
            if (this.purchase.tariffs) {
                this.stepsDone[0] = true;
                this.stepsDisabled = [false, false, false, false];
            } else {
                this.stepsDone = [false, false, false, false];
                this.stepsDisabled = [false, true, true, true];
            }
            if (this.purchase.coupons) {
                this.stepsDone[1] = true;
            } else {
                this.stepsDone[1] = false;
            }
            if (this.purchase.personal && this.purchase.personal.email && this.purchase.personal.middlename && this.purchase.personal.name && this.purchase.personal.surname) {
                this.stepsDone[2] = true;
            } else {
                this.stepsDone[2] = false;
            }
        }
    }
    
    selectStep(step: number) {
        this.saveOldStepData();
        this.setStep(step);
        this.fillSavedStepData();
    }
    
        saveOldStepData() {
            switch(this.currentStep) {
            case 0:
                this.tariffsSave = this.tariffStep.getTariffs();
                break;
            case 1:
                this.productsSave = this.productStep.getProducts();
                break;
            default: 
                break;
            }
        }
        
        setStep(step: number) {
            if (step < 0) {
                step = 0;
            }
            if (step > this.stepsDone.length - 1) {
                step = this.stepsDone.length - 1;
            }
            this.currentStep = step;
            this.cdr.detectChanges();
        }
        
        fillSavedStepData() {
            switch(this.currentStep) {
            case 0:
                if (this.tariffsSave) {
                    this.tariffStep.setTariffs(this.tariffsSave); 
                    this.tariffStep.setPurchases(this.purchase.tariffs);
                } else {
                    this.acquireTariffs();
                }
                break;
            case 1:
                if (this.productsSave) {
                    this.productStep.setProducts(this.productsSave); 
                    this.productStep.setPurchases(this.purchase.coupons);
                } else {
                    this.acquireCoupons();
                }
                break;
            case 2:
                if (this.purchase.personal) {
                    this.personalStep.setPersonal(this.purchase.personal);
                }
                break;
            default:
                break;
            }
        }
    
        
    /* TARIFF STEP */
    acquireTariffs() {
        if (!this.eventId) {
            this.eventId = 0;
        }
        this.service.getTariffs(this.eventId).subscribe(
                data => {
                    this.tariffStep.setPurchases(null);
                    this.tariffStep.setTariffs(data);
                }
        );
    }
        
    setTariffs(tariffs: TicketEntity[]) {
        this.purchase.tariffs = tariffs;
        this.checkSteps();
    }
    
    /* COUPON STEP */
    acquireCoupons() {
        if (!this.eventId) {
            this.eventId = 0;
        }
        this.service.composeProducts(this.eventId).subscribe(
            products => {
                this.productStep.setProducts(products);
            }
        );
    }
    
    setCoupons(coupons: CouponEntity[]) {
        this.purchase.coupons = coupons;
        this.checkSteps();
    }
    
    /* PERSONAL STEP */
    setPersonal(personal: UserEntity) {
        this.purchase.personal = personal;
        this.checkSteps();
    }
}