import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Choice, SectionService } from './section.service';

@Component({
  selector: 'app-choice-section',
  template: `
      <div>
        <ng-content></ng-content>
        <br><br>
          <ion-segment (ionChange)=onChange($event)>
            <ion-segment-button *ngFor="let choice of choices" [value] = "choice.value" labelPlacement="start"><ion-text><h3>{{choice.label}}</h3></ion-text></ion-segment-button>
            <br *ngIf="choices && choices.length > 2">
          </ion-segment>
      </div>
  `,
  styleUrls: ['choice-section.component.scss']
})
export class ChoiceSectionComponent implements OnInit{
  @Input() sectionID: string = "";
    
  choices : Choice[] | undefined;

  constructor(private sectionService: SectionService) {
	
  }
  
  ngOnInit(){
    this.choices = this.sectionService.getSectionById(this.sectionID)?.choices;
    console.log(`Initialized with choices: ${this.choices}`)
  }
  
  onChange(event: CustomEvent) {
    console.log('Selected Value: ', event.detail.value);
	  this.sectionService.updateVisibilityBasedOnChoice(this.sectionID, event.detail.value);
    this.sectionService.showNextSection(this.sectionID);
    // You can use event.detail.value to react to the change
    // For instance, updating your model or making API calls
  }
  
  isVisible(): boolean{
	  return this.sectionService.isVisible(this.sectionID);
  }
}