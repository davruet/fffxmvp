import {Component, QueryList, ViewChildren, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Import environment
import { SectionVisibilityStateMachine } from './section-visibility-state-machine';
import { SectionComponent } from '../sections/section.component';
import { SectionObserver } from '../sections/section-observer.interface';
import { Subscription } from 'rxjs';


interface FoodForest {
  id: number;
  name: string;
  enabled: boolean;
}

interface Ingredient {
  id: number;
  name: string;
  enabled: boolean; // rename to selected
  available: boolean;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements AfterViewInit, OnInit, SectionObserver {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChildren(SectionComponent) sections!: QueryList<SectionComponent>;
  
  constructor(private animationCtrl: AnimationController, private http: HttpClient) {
    
  }
  
  private sectionSubscription!: Subscription;

  
  notifySectionChange(sectionId: string): void {    
    const matchedSections = this.sections.filter(s=>s.sectionID === sectionId);
    if (matchedSections.length > 0){
      requestAnimationFrame(() => {
        matchedSections[0].getElementRef().nativeElement.scrollIntoView({behavior: "smooth", block:"end", inline:"nearest"});

      });
    }
  }
  
  
  ngAfterViewInit() {
    this.sectionSubscription = this.sections.changes.subscribe(() => {
      console.log("Section change!");
      this.subscribeToSectionChanges();
    });
    //this.observeSections();
    this.subscribeToSectionChanges();
    console.log(this.sections);
  }
  
  private subscribeToSectionChanges() {
    // Reset and subscribe to new sections
    this.sections.forEach(section => {
      section.addObserver(this);
    });
  }

  
  ngOnInit() {
    this.http.get(environment.dataUrl).subscribe({
      next: jsonData => {
        console.log('JSON Data loaded', jsonData);
        this.initParameters(jsonData);
      },
       complete: ()=>{
          this.parametersLoading = false; // Stop loading once data is received
        },
        error: (err) =>{
        this.parametersLoading = false; // Stop loading on error
        console.error('There was an error!', err);
        }
      })

  }
  
  ngOnDestroy() {
    // Clean up the subscription
    if (this.sectionSubscription) {
      this.sectionSubscription.unsubscribe();
    }
  }
  
  /*
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
  }*/
  
  
  scrollToNextSection(event: MouseEvent) {
    /*const currentButton = event.target as HTMLElement;
    const currentSection = currentButton.closest('section');
    const sectionsArray = this.sections.toArray();

    const currentIndex = sectionsArray.findIndex(el => el.nativeElement === currentSection);
    const nextIndex = currentIndex + 1;
    const nextSection = sectionsArray[nextIndex];
    if (nextIndex > this.visibleSectionIndex){
      this.visibleSectionIndex = nextIndex;
    }
    

    if (nextSection) {
      console.log(`scrollto ${nextSection.nativeElement.offsetTop}`)
       nextSection.nativeElement.scrollIntoView({behavior: "smooth", block:"end", inline:"nearest"});
    }*/
    
  }
  
  visibleSectionIndex:number = 0;

  
  parameters: any;
  parametersLoading: boolean = true;
  
  initParameters(params: any){
    this.parameters = params;
    this.foodForests = params["Food Forests"].map((item:any, index: number) => {
        return {
        id: index + 1, // Assuming ID starts from 1 and increments
        name: item["NAME of FF (public)"], // Using the public name as 'name'
        enabled: true // Setting 'enabled' to true for all items
      }});
    this.ingredients = params["Food Forest Ingredient"].map((item:any, index: number) => {
      return {
      id: index + 1, // Assuming ID starts from 1 and increments
      name: item["ABREVIATION (20-25 ch)"], 
      enabled: false,
      available: index < 5 // FIXME
    }});
    this.ingredients.splice(5);
  }
  
  /*foodForests = [
    { id: 1, name: 'Amsterdam Food', enabled: true },
    { id: 2, name: 'Mandius Food Forest', enabled: true  },
    { id: 3, name: 'Food Forest Pantry', enabled: true  },
  ]*/
  foodForests: FoodForest[]= [];
  
  ingredients: Ingredient[] = [
    { id: 1, name: 'Yarrow', enabled: true, available:true },
    { id: 2, name: 'Sweet Chestnut', enabled: true , available:true },
    { id: 3, name: 'Daylillies', enabled: true , available:true },
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