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
  id: string;
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
    return s.section.next;
  }
  
  private nextSectionEvent:EventEmitter<String> = new EventEmitter();

  private sectionsOrdered: Section[]  = [
     {id: 'start', next: 'select-food-forest'},
     {id: 'select-food-forest', next: 'select-date'},
     {id: 'select-date', next: 'select-ingredients'},
     {id: 'select-ingredients', next: 'customise-or-surprise'},
     {id: 'customise-or-surprise',
      choices: [{
        value: 'eat-or-preserve',
        label: 'Customise'
      }, {
        value: 'surprise-me',
        label: 'Surprise'
      }]
    },
    {id: 'eat-or-preserve',
      choices: [{
        value: 'specify-protein',
        label: 'Eat'
      }, {
        value: 'preserve',
        label: 'Preserve'
      }]
    },
    {id: 'specify-protein',
      choices: [{
        value: 'typology',
        label: 'No Thanks'
      }, {
        value: 'mvp',
        label: 'Select Protein'
      }]
    },
    {id: 'typology',
      next: 'generate'
    },
    {id: 'mvp',
      next: 'generate'
    },
    {id: 'preserve',next: 'generate'},
    {id: 'surprise-me',next: 'disclaimer'},
    {id: 'disclaimer',
		choices: [{
		  value: 'generate',
		  label: 'Yes'
		}, {
		  value: 'no',
		  label: 'No'
		}]
	  },
    {id: 'no',
      
    },
	  {id: 'generate', next: 'recipe'},
	  {id: 'recipe', next: 'do-you-like'},
    {id: 'do-you-like', 
        choices: [{
        value: 'like',
        label: 'Yes'
      }, {
        value: 'dislike',
		  label: 'No'
		}]},
    {id: 'like',
      choices: [{
        value: 'email',
        label: 'Yes'
      }, {
        value: 'startover',
		  label: 'No Thanks'
    }]},
    {id: 'dislike',
      choices: [{
        value: 'email',
        label: 'Yes'
      }, {
        value: 'startover',
		  label: 'No Thanks'
    }]},
    {id: 'email',
      next:'startover'  
    },
    {id: 'startover',
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
    {id: 'done',
      
    }
  ];
  
  sections: { [key: string]: { section: Section, index: number } } = this.sectionsOrdered.reduce((acc, section, index) => {
    acc[section.id] = { section, index };
    return acc;
}, {} as { [key: string]: { section: Section, index: number } });

  constructor() { 
    this.sectionsOrdered.forEach(s=>{
      s.isVisible = SectionState.Hidden;
    })
    const first = this.sections['start'];
    first.section.isVisible = SectionState.Visible;

  }
  
  addEventHandler(handler:NextHandler){
    this.nextSectionEvent.subscribe(handler);
  }

  getSectionById(sectionId: string): Section | undefined {
    return this.sections[sectionId].section;
  }
  
  showSection(sectionID: string){
    const s = this.sections[sectionID];
    s.section.isVisible = SectionState.Visible;
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
      return section.section.isVisible == SectionState.Visible;
    }
  }
  

  updateVisibilityBasedOnChoice(sectionID: string, choice: string) {
    const section = this.sections[sectionID];
    // check if section already is visible, we will skip setting next later if so, and simply hide everything after
    const nextSection = this.sections[choice];
    if (section.section.choices){
      const change = section.section.next !== choice;
      if (change){
        for (let i = section.index + 1; i < this.sectionsOrdered.length; i++){
          this.sectionsOrdered[i].isVisible = SectionState.Hidden;
          console.log(`hiding section ${this.sectionsOrdered[i].id}`)
          if (this.sectionsOrdered[i].choices){ // clear next if there are choices.
            this.sectionsOrdered[i].next = undefined;
          }
        }
        
      }
      
      if (nextSection.index > section.index) {
        // new section, add it to the path.
        section.section.next = choice;
      } 
      this.showSection(choice);

    } else {
      console.log(`Invalid section: ${choice}`);
    }   
  }

    
}
