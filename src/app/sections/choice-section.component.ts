import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SectionVisibilityStateMachine } from '../home/section-visibility-state-machine';
import { Choice, SectionService } from './section.service';

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
export class ChoiceSectionComponent implements OnInit{
  @Input() sectionID: string = "";
  @Output() nextSectionEvent = new EventEmitter<string | null>();
  
  choices : Choice[] | undefined;

  constructor(private stateMachine: SectionVisibilityStateMachine, private sectionService: SectionService) {
	
  }
  
  ngOnInit(){
	this.choices = this.sectionService.getSectionById(this.sectionID)?.choices;
	console.log(`Initialized with choices: ${this.choices}`)
  }
  
  onRadioChange(event: CustomEvent) {
    console.log('Selected Value: ', event.detail.value);
	this.stateMachine.updateVisibilityBasedOnChoice(this.sectionID, event.detail.value);
	
    // You can use event.detail.value to react to the change
    // For instance, updating your model or making API calls
  }
  
  isVisible(): boolean{
	return this.stateMachine.isVisible(this.sectionID);
  }
  nextSection(nextSectionId: string | null){
	this.nextSectionEvent.emit(nextSectionId);
  }
}