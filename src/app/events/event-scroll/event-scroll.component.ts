import { Component, ChangeDetectionStrategy, Inject, OnInit, HostListener } from '@angular/core';
import { TooltipPosition } from '@angular/material';
import { PageScrollInstance, PageScrollService, PageScrollConfig } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';
import { IconListService } from '../icon-list.service';

@Component({
	selector: 'scroll-button',
	templateUrl: './event-scroll.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ScrollButton implements OnInit {	 
	private position: TooltipPosition = 'below';
	private message: string = 'Наверх';
	
	private showDelay: number = 0;
	private hideDelay: number = 0;
	private isSscrollButtonFixed: boolean = false;
	
	@HostListener('window:scroll', ['$event'])
    public onWindowScroll($event: Event) : void {
		let num = this.document.body.scrollTop;
		if(num > ScrollSettings.DEFAULT_SCROLL_SHOW_POSITION) {
			this.isSscrollButtonFixed = true;
		} else if (this.isSscrollButtonFixed && num < ScrollSettings.DEFAULT_SCROLL_HIDE_POSITION) {
			this.isSscrollButtonFixed = false;
		}
    }
	
	constructor(@Inject(DOCUMENT) private document: Document, private pageScrollService: PageScrollService) { }
	
	private scrollToTop() : void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#main');
        this.pageScrollService.start(pageScrollInstance);
	}
	
	public ngOnInit() : void {
		PageScrollConfig.defaultScrollOffset = ScrollSettings.DEFAULT_SCROLL_OFFSET;
        PageScrollConfig.defaultEasingLogic = ScrollSettings.DEFAULT_SCROLL_LOGIC;
	}
}

class ScrollSettings
{
	public static DEFAULT_SCROLL_SHOW_POSITION: number = 100;
	public static DEFAULT_SCROLL_HIDE_POSITION: number = 100;
	public static DEFAULT_SCROLL_OFFSET: number = 50;
	public static DEFAULT_SCROLL_LOGIC =
	{
        ease: (t: number, b: number, c: number, d: number): number =>
		{
            if (t === 0) return b;
            if (t === d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };
}