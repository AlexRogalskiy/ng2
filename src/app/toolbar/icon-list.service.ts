import { Component, ViewEncapsulation, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { IIconModel } from './icon.model';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class IconListService {
	
	constructor(private mdIconRegistry: MdIconRegistry, private sanitizer: DomSanitizer) {
	}
	
	public register(itemList: Array<IIconModel>) : void {
		Observable.from(itemList).subscribe((value) => this.mdIconRegistry.addSvgIcon(value.label, this.sanitizer.bypassSecurityTrustResourceUrl(value.path)));
	}
}