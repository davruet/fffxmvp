import {Component, QueryList, ViewChildren, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChildren('section') sections!: QueryList<ElementRef>;

  constructor(private animationCtrl: AnimationController) {}
  
  ngAfterViewInit() {
    this.observeSections();
  }
  
  private observeSections() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateSection(entry.target);
          observer.unobserve(entry.target); // Optional: Stop observing once animated
        }
      });
    }, {threshold: 0.1});

    this.sections.forEach(section => {
      section.nativeElement.style.opacity = '0'; // Set initial opacity to 0
      observer.observe(section.nativeElement);
    });
  }

  private animateSection(element: Element) {
    console.log("Animating in " + element)
    const animation = this.animationCtrl.create()
      .addElement(element)
      .duration(1000)
      .fromTo('opacity', '0', '1');

    animation.play();
  }
  
  
  scrollToNextSection(event: MouseEvent) {
    const currentButton = event.target as HTMLElement;
    const currentSection = currentButton.closest('section');
    const sectionsArray = this.sections.toArray();

    const currentIndex = sectionsArray.findIndex(el => el.nativeElement === currentSection);
    const nextSection = sectionsArray[currentIndex + 1];

    if (nextSection) {
      console.log(`scrollto ${nextSection.nativeElement.offsetTop}`)
      //this.content.scrollToPoint(0,nextSection.nativeElement.offsetTop,1000);
       nextSection.nativeElement.scrollIntoView({behavior: "smooth", block:"end", inline:"nearest"});
    }
    
  }
  foodForests = [
    { id: 1, name: 'Amsterdam Food', enabled: true },
    { id: 2, name: 'Mandius Food Forest', enabled: true  },
    { id: 3, name: 'Food Forest Pantry', enabled: true  },
  ]
  
  ingredients = [
    { id: 1, name: 'Yarrow', enabled: true },
    { id: 2, name: 'Sweet Chestnut', enabled: true  },
    { id: 3, name: 'Daylillies', enabled: true  },
  ]
  
  customizeOrSurprise!: string;
  eatOrPreserve!: string;
  protein!: string;
  proceed!: string;

  
isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth();
    console.log(utcMonth);
    
    /**
     * Date will be enabled if it is not
     * Sunday or Saturday
     */
    return utcYear == 2024 && (utcMonth == 3 || utcMonth == 4 || utcMonth == 5) 
  };
  
}