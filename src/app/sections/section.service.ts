import { EventEmitter, Injectable } from '@angular/core';

export interface Choice {
  value: string;
  label: string;
}

enum SectionState {
	Hidden,
	Visible,
}

interface Section {
  next?: string;
  choices?: Choice[];
  isVisible?: SectionState;
}

export type NextHandler = (input: string) => void;


@Injectable({
  providedIn: 'root'
})

export class SectionService {
  
  getNextSection(sectionID: string): string | undefined {
    const s = this.sections[sectionID];
    return s.next;
  }
  
  private nextSectionEvent:EventEmitter<String> = new EventEmitter();

  private sections: { [key: string]: Section } = {
    'start': {next: 'select-food-forest'},
    'select-food-forest': {next: 'select-date'},
    'select-date': {next: 'select-ingredients'},
    'select-ingredients': {next: 'customize-or-surprise'},
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
        value: 'specify-protein',
        label: 'Eat'
      }, {
        value: 'preserve',
        label: 'Preserve'
      }]
    },
    'specify-protein': {
      choices: [{
        value: 'typology',
        label: 'No Thanks'
      }, {
        value: 'select-protein',
        label: 'Select Protein'
      }]
    },
    'typology': {
      next: 'generate'
    },
    'select-protein': {
      next: 'generate'
    },
  'preserve': {next: 'generate'},
	'surprise': {next: 'disclaimer'},
	'disclaimer': {
		choices: [{
		  value: 'generate',
		  label: 'Yes'
		}, {
		  value: 'no',
		  label: 'No'
		}]
	  },
    'no':{
      
    },
	  'generate': {next: 'recipe'},
	  'recipe': { next: 'do-you-like'},
    'do-you-like': {
        choices: [{
        value: 'like',
        label: 'Yes'
      }, {
        value: 'dislike',
		  label: 'No'
		}]},
    'like':{
      choices: [{
        value: 'email',
        label: 'Yes'
      }, {
        value: 'startover',
		  label: 'No Thanks'
    }]},
    'dislike':{
      choices: [{
        value: 'email',
        label: 'Yes'
      }, {
        value: 'startover',
		  label: 'No Thanks'
    }]},
    'email':{
      next:'startover'  
    },
    'startover':{
      choices: [{
        value: 'generate',
        label: 'Generate another recipe'
      }, {
        value: 'start',
		    label: 'Start from the beginning'
      }, {
        value: 'done',
		    label: 'Thanks, I\'m done!'
      }
    ]},
    'done':{
      
    }
  };

  constructor() { 
    Object.keys(this.sections).forEach(k=>{
      this.sections[k].isVisible = SectionState.Hidden;
    })
    const first = this.sections['start'];
    first.isVisible = SectionState.Visible;

  }
  
  addEventHandler(handler:NextHandler){
    this.nextSectionEvent.subscribe(handler);
  }

  getSectionById(sectionId: string): Section | undefined {
    return this.sections[sectionId];
  }
  
  showSection(sectionID: string){
    const s = this.sections[sectionID];
    s.isVisible = SectionState.Visible;
    this.nextSectionEvent.emit(sectionID);
  }
  
  showNextSection(currentSectionId: string): string | undefined {
    /*
    const s = this.sections[currentSectionId];
    if (s.next){
      const nextSection = this.sections[s.next];
      nextSection.isVisible = SectionState.Visible;
      console.log(`Returning next: ${s.next}`)
      this.nextSectionEvent.emit(s.next);
      return s.next;
    }
    return null;*/
    const nextSection : string | undefined = this.getNextSection(currentSectionId);
    if (nextSection){
      this.showSection(nextSection);
    }
    return nextSection;
  }
  
  isVisible(id: string): boolean {
    const section = this.sections[id];
    if (! section) {
      console.log(`Section ${id} not found.`);
      return false;
    } else {
      return section.isVisible == SectionState.Visible;
    }
  }
  

  updateVisibilityBasedOnChoice(sectionID: string, choice: string) {
    const section = this.sections[sectionID];
    // check if section already is visible, we will skip setting next later if so
    const wasVisible: boolean = this.sections[choice].isVisible === SectionState.Visible;
    if (section.choices){
      const change = section.next !== choice;
      if (change){
        let next: string | undefined = choice;
        while (next){  
          const s : Section = this.sections[next];
          s.isVisible = SectionState.Hidden;
          console.log(`hid section ${next}`);
          next = s.next;
        }
      }
      
      if (!wasVisible) {
        // new section, add it to the path.
        section.next = choice;
      }
      this.showSection(choice);

    } else {
      console.log(`Invalid section: ${choice}`);
    }   
  }

    
}
