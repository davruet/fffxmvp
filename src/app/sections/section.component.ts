import { Component, ElementRef, EventEmitter, Output, Input, OnInit, Type, ChangeDetectorRef } from '@angular/core';
import { SectionVisibilityStateMachine } from '../home/section-visibility-state-machine';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SectionObserver } from './section-observer.interface';


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

      <ng-content select="[section-body]"></ng-content> <!-- Place for subclass content -->
      <br>
      <ion-button (click)="nextSection()" fill="clear">
        <ion-icon aria-label="next page" slot="icon-only" name="chevron-down-outline"></ion-icon>
      </ion-button>
  
  </section>
`,
styleUrls: ['section.component.scss'],

})

export class SectionComponent implements OnInit {
  
  @Input() sectionID: string = "";
  @Output() nextSectionEvent = new EventEmitter<string | null>();


  nextSection() {
    const nextSectionId = this.stateMachine.showNextSection(this.sectionID);
    this.nextSectionEvent.emit(nextSectionId);
    //document.getElementById(nextSectionId)?.scrollIntoView({ behavior: 'smooth' }); FIXME
  }
  
  isVisible(): boolean {
    return this.stateMachine.isVisible(this.sectionID);
  }

  constructor(private elementRef: ElementRef, private stateMachine: SectionVisibilityStateMachine) { 
  }
  
  getElementRef(): ElementRef {
    return this.elementRef;
  }

  
  ngOnInit() {}


}