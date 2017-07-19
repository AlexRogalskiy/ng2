import { Component, Output, EventEmitter } from '@angular/core';
import { UserEntity } from '../entity/user.entity';

@Component({
    selector: 'order-personal',
    templateUrl: 'personal.component.html',
    styleUrls: ['personal.component.css'],
})
export class OrderPersonal {
    
    @Output() update = new EventEmitter<UserEntity>();
    personalData: UserEntity;
    
    constructor() {
        this.personalData = new UserEntity();
    }
    
    setPersonal(data: UserEntity) {
        this.personalData = data;
    }
    
    save() {
        this.update.emit(this.personalData);
    }
    
}