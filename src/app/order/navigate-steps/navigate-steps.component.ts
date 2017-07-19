/* By Kirill Chirkov v.1.2 */
import {NgModule, Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'navigate-steps',
    templateUrl: 'navigate-steps.component.html',
    styleUrls: ['./navigate-steps.component.css'],
})
export class NavigateStepsComponent {

    @Input('stepsDone') stepsDone: boolean[];
    @Input('stepsDisabled') stepsDisabled: boolean[];
    @Input('currentStep') currentStep: number = 0;
    @Input('stepContent') stepContent: string[];

    @Output() selectStep = new EventEmitter<number>();

    select(step: number) {
        if (step < 0) {
            step = 0;
        } else if (step > this.stepContent.length - 1) {
            step = this.stepContent.length - 1;
        }
        if (this.stepsDisabled && this.stepsDisabled[step]) {
            return;
        }
        this.currentStep = step;
        this.selectStep.emit(step);
    }

}