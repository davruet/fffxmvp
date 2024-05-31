/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information.
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BasicRecipe } from './recipe.interfaces';

@Component({
	selector: 'app-choice-section',
	template: `
	  <app-base-section [sectionID]="sectionID" *ngIf="isVisible()" (nextSectionEvent)="nextSection($event)">
		<div section-body>
		 <ng-content select="[section-body]"></ng-content>
			<ion-radio-group (ionChange)=onRadioChange($event)>
			  <ion-radio *ngFor="let choice of choices" [value] = "choice.value" labelPlacement="start">{{choice.label}}</ion-radio> 
		  </ion-radio-group>
  
		</div>
	  </app-base-section>
	`,
	styles: [`
	ion-radio {
	  --color:transparent;
	  --color-checked: primary;
	  --width:0px
	}
	`]
  })
  
  export class RecipeComponent  implements OnInit {
	  
	  ngOnInit(): void {
		  
	  }
	  
	  basicRecipe!: BasicRecipe;
  }
  