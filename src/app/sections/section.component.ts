/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */

import { Component, ElementRef, EventEmitter, Output, Input, OnInit, Type, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SectionObserver } from './section-observer.interface';
import { SectionService } from './section.service';


@Component({
  selector: 'app-base-section',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  template: `
  <section @fadeIn class="page" *ngIf="isVisible()">

      <ng-content></ng-content> <!-- Place for subclass content -->
      <br>
      <ion-button class="section-button" *ngIf="showNextButton" (click)="nextSection()" fill="clear" [disabled]="disableButtonFunction()">
        <ion-icon aria-label="next page" slot="icon-only" name="chevron-down-outline"></ion-icon>
      </ion-button>
  
  </section>
`,
styleUrls: ['section.component.scss'],

})

export class SectionComponent implements OnInit {
  
  @Input() sectionID: string = "";
  @Input() showNextButton: boolean = true;
  @Input() disableButtonFunction: () => boolean = () => false;

  @Output() nextSectionEvent = new EventEmitter<string | null>();
  
  isButtonDisabled = false; // Initialize with the default state of the button



  nextSection() {
    const nextSectionId = this.sectionService.showNextSection(this.sectionID);
    if (nextSectionId) {
      this.nextSectionEvent.emit(nextSectionId);
    }
    //document.getElementById(nextSectionId)?.scrollIntoView({ behavior: 'smooth' }); FIXME
  }
  
  isVisible(): boolean {
    return this.sectionService.isVisible(this.sectionID);
  }

  constructor(private elementRef: ElementRef, private sectionService: SectionService) { 
  }
  
  getElementRef(): ElementRef {
    return this.elementRef;
  }

  
  ngOnInit() {}


}