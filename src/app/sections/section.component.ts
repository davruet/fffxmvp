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
  <section @fadeIn class="page" *ngIf="isSectionVisible()">

      <ng-content></ng-content> <!-- Place for subclass content -->
      <br>
      <ion-button (click)="showNextSection($event)" fill="clear">
        <ion-icon aria-label="next page" slot="icon-only" name="chevron-down-outline"></ion-icon>
      </ion-button>
  
  </section>
`,
styleUrls: ['section.component.scss'],

})

export class SectionComponent implements OnInit {
  
  @Input() sectionID!: string; // Assuming the sectionID is passed as an input for now

  private observers: Set<SectionObserver> = new Set<SectionObserver>();
  
  // Register an observer. Does not register an already-registered observer.
  addObserver(observer: SectionObserver) {
    this.observers.add(observer);
  }


  isSectionVisible(){
    return this.stateMachine.isVisible(this.sectionID);
  }
  
  
  showNextSection(event: MouseEvent) {
    const nextSectionId = this.stateMachine.showNextSection(this.sectionID);
    this.cdRef.detectChanges();
    if (nextSectionId){
      this.observers.forEach(observer => observer.notifySectionChange(nextSectionId));

    }
  }
  
  canScrollToNextSection(): boolean {
    return true;
  }
  

  constructor(private stateMachine: SectionVisibilityStateMachine, private elementRef: ElementRef, private cdRef: ChangeDetectorRef) { 
  }
  
  getElementRef(): ElementRef {
    return this.elementRef;
  }

  
  ngOnInit() {}


}