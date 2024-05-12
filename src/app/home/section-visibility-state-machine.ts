import { Injectable } from '@angular/core';


enum SectionState {
	Hidden,
	Visible,
}

interface Section {
	id: string;
	state: SectionState;
	nextID?: string; // Optional property to handle dependency on other sections
}

@Injectable({
	providedIn: 'root',
  })
export class SectionVisibilityStateMachine {
	
	sections: Section[] = [];
	
	constructor() {
		/*const sections = {
			'start':{next:['select-food-forest']},
			'select-food-forest':{next:['select-date']},
			'select-date':{next:['select-ingredients']}, 
			'select-ingredients':{next:['customize-or-surprise']},
			'customize-or-surprise:':{
				next:['eat-or-preserve', 'surprise']
			},
			'eat-or-preserve:':{
				next:['eat', 'preserve']
			}
		}*/
		const sectionIds = [
			'start', 
			'select-food-forest', 
			'select-date', 
			'select-ingredients',
			'customize-or-surprise',
			'eat-or-preserve',
			'specify-protein',
			'no-specific-protein',
			'select-protein',
			'surprise',
			'disclaimer',
			'generate',
			'recipe'
			
			
		];
		this.sections = sectionIds.map(id => ({ id, state: SectionState.Hidden }));
		this.initialize();
	}

	// Initialize visibility based on dependencies
	initialize() {
		this.sections[0].state = SectionState.Visible; // Make the first section visible by default
	}

	// Method to set visibility based on a condition, for example, a user's choice
	updateVisibilityBasedOnChoice(sectionID: string, choice: string) {
		const section = this.getSectionById(sectionID);
		const currentIndex = this.findCurrentIndex(sectionID);
		
		if (currentIndex !== -1 && currentIndex < this.sections.length - 2) { 
			const section = this.sections[currentIndex];
			if (section.nextID != choice){
				// hide all subsequent sections
				for (let i = currentIndex + 1; i < this.sections.length; i++){
					const section = this.sections[i];
					section.state = (section.id == choice)?SectionState.Visible:SectionState.Hidden;
				}
				console.log(`setting choice to ${section.nextID}`)
				section.nextID = choice;
			}
		}
		
		
	}

	// Method to make the next section visible
	showNextSection(currentSectionId: string): string | null {
		console.log(`ShowNextSection: ${currentSectionId}`);

		const currentIndex = this.findCurrentIndex(currentSectionId);
		if (currentIndex !== -1 && currentIndex < this.sections.length - 1) {
			const currentSection = this.sections[currentIndex];
			let nextSection: Section | undefined;
			if (currentSection.nextID){
				nextSection = this.getSectionById(currentSection.nextID);
				console.log(`Found nextsection: ${nextSection}`)
			} else {
				nextSection = this.sections[currentIndex + 1];
			}
			if (nextSection){
				nextSection.state = SectionState.Visible;	
				console.log(`Making visible section: ${nextSection.id}`);
				return nextSection.id;
			}
			
		}
		return null;
	}
	
	findCurrentIndex(currentSectionId: string): number {
		return this.sections.findIndex(section => section.id === currentSectionId);
	}
	
	getSectionById(sectionID: string): Section | undefined{
		return this.sections.find(section => section.id === sectionID);
	}

	// Check if a section is visible
	isVisible(id: string): boolean {
		let val = this.sections.find(section => section.id === id)?.state === SectionState.Visible;
		//console.log(`Checking visibility for ${id}: ${val}`);

		return val;
	}
}
