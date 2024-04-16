import { Injectable } from '@angular/core';

export interface Choice {
  value: string;
  label: string;
}

interface Section {
  next?: string[];
  choices?: Choice[];
}

@Injectable({
  providedIn: 'root'
})

export class SectionService {
  private sections: { [key: string]: Section } = {
    'start': {next: ['select-food-forest']},
    'select-food-forest': {next: ['select-date']},
    'select-date': {next: ['select-ingredients']},
    'select-ingredients': {next: ['customize-or-surprise']},
    'customize-or-surprise': {
      choices: [{
        value: 'eat-or-preserve',
        label: 'Customize'
      }, {
        value: 'surprise',
        label: 'Surprise'
      }]
    },
    'eat-or-preserve': {
      choices: [{
        value: 'eat',
        label: 'Eat'
      }, {
        value: 'preserve',
        label: 'Preserve'
      }]
    },
	'surprise': {next: ['disclaimer']},
	'disclaimer': {
		choices: [{
		  value: 'generating',
		  label: 'Yes'
		}, {
		  value: 'no',
		  label: 'No'
		}]
	  },
	  'generating': {next: ['recipe']},
	  'recipe': {},
  };

  constructor() { }

  getSectionById(sectionId: string): Section | undefined {
    return this.sections[sectionId];
  }
}
