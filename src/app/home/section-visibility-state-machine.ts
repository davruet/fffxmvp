import { Injectable } from '@angular/core';


enum SectionState {
	Hidden,
	Visible,
}

interface Section {
	id: string;
	state: SectionState;
	dependsOn?: string; // Optional property to handle dependency on other sections
}

@Injectable({
	providedIn: 'root',
  })
export class SectionVisibilityStateMachine {
	
	sections: Section[] = [];
	
	constructor() {
		const sections = {
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
		}
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
			
			
		];
		this.sections = sectionIds.map(id => ({ id, state: SectionState.Hidden }));
		this.initialize();
	}

	// Initialize visibility based on dependencies
	initialize() {
		this.sections[0].state = SectionState.Visible; // Make the first section visible by default
	}

	// Method to set visibility based on a condition, for example, a user's choice
	setVisibilityBasedOnChoice(choice: string, targetSectionIds: string[]) {
		if (choice === 'customize') {
			targetSectionIds.forEach(id => {
				const section = this.sections.find(section => section.id === id);
				if (section) {
					section.state = SectionState.Visible;
				}
			});
		}
	}

	// Method to make the next section visible
	showNextSection(currentSectionId: string): string | null {
		const currentIndex = this.sections.findIndex(section => section.id === currentSectionId);
		if (currentIndex !== -1 && currentIndex < this.sections.length - 1) {
			const section = this.sections[currentIndex + 1];
			section.state = SectionState.Visible;			
			return section.id;
		}
		return null;
	}

	// Check if a section is visible
	isVisible(id: string): boolean {
		let val = this.sections.find(section => section.id === id)?.state === SectionState.Visible;
		return val;
	}
}
