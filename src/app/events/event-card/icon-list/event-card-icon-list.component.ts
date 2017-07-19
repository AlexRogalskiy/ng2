import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { IconListService } from '../../../toolbar/icon-list.service';
import { IIconModel } from '../../../toolbar/icon.model';

import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'md-icons',
	templateUrl: 'event-card-icon-list.component.html',
	styleUrls: ['event-card-icon-list.component.css'],
})

export class EventCardIconList implements OnInit {
	private iconSet: Array<IIconModel> =
	[
		{label: 'favorite', path: '../assets/icon/favorite.svg'},
		{label: 'options', 	path: '../assets/icon/options.svg'},
		{label: 'share', 	path: '../assets/icon/share.svg'}
	];
	
	public ngOnInit(): void {
		this.registerIcons(this.iconSet);
	}
	
	constructor(private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer, @Inject(IconListService) private iconList: IconListService) {}
	
	public registerIcons(itemList: Array<IIconModel>) : void {
		Observable.from(itemList).subscribe((value) => this.mdIconRegistry.addSvgIcon(value.label, this.sanitizer.bypassSecurityTrustResourceUrl(value.path)));
	}
}