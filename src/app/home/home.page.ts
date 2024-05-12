import {Component, OnChanges, QueryList, ViewChildren, ViewChild, ElementRef, AfterViewInit, OnInit, SimpleChanges } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Import environment
import { SectionVisibilityStateMachine } from './section-visibility-state-machine';
import { SectionComponent } from '../sections/section.component';
import { SectionService } from '../sections/section.service';
import { SurpriseRecipe, PreservedRecipe, FreshByTypology, FreshByProduct, BasicRecipe, IngredientList, Ingredient, FoodForest, MVP, RecipeOption, PromptTemplate } from '../recipe.interfaces';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements AfterViewInit, OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChildren(SectionComponent) sections!: QueryList<SectionComponent>;
  
  
  constructor(private animationCtrl: AnimationController, private http: HttpClient, private stateMachine: SectionVisibilityStateMachine, private sectionService: SectionService) {
    
  }
  
  
  ngAfterViewInit() {

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

  }
  
  parameters: any;
  parametersLoading: boolean = true;
  
  foodForests: FoodForest[]= [];
  
  mvps: MVP[] = [];
  
  promptTemplates: PromptTemplate[] = [];
  
  options: RecipeOption[] = [];
  
  initParameters(params: any){
    this.parameters = params;
    this.foodForests = params["Food Forests"].map((item:any, index: number) => {
        return {
        id: index + 1, // Assuming ID starts from 1 and increments
        name: item["NAME of FF (public)"], // Using the public name as 'name'
        enabled: true // Setting 'enabled' to true for all items
      }});
    this.mvps = params["MVPs"].map((data:any, index:number) =>
      ({
        productName: data["PRODUCT NAME"],
        companyName: data["COMPANY NAME"],
        linkToInfo: data["LINK TO INFO"],
        mvpCategory: data["MVP CATEGORY"],
        abbreviation: data["ABBREVIATION"]
      })
    );
    this.promptTemplates = params['prompt-templates'];
    this.options = params['options'];
    console.log(this.options);

    this.handleFFChange(this.foodForests);
  }
  
  handleFFChange(updatedItems: any[]){
    console.log(`changes ${updatedItems}`); // FIXME THIS IS NOT WORKING
    console.log("food forests change!");
    let validForests = this.foodForests.filter(f=>f.enabled).map(f=>f.name);
    console.log(validForests);
    
    // Update available ingredients in list.
    this.ingredients = this.parameters["Food Forest Ingredient"]
      .filter((i:any)=>validForests.includes(i["FOOD FOREST"]))
      .map((item:any, index: number) => {
        return {
        id: index + 1, // Assuming ID starts from 1 and increments
        name: item["ABREVIATION (20-25 ch)"], 
        enabled: false,
        description: item["20-40 WORDS"]
        //available: index < 5 // FIXME
      }});
      console.log(this.ingredients);
      //this.ingredients.splice(5);
      
      // Ingredients may have changed (no longer available)
      this.handleIngredientsChange(this.ingredients);
  }
  
handleIngredientsChange(updatedItems: any){
    const filteredIngredients = (updatedItems as Ingredient[]).filter(i=>i.enabled);
    const ingredientStrings = filteredIngredients.map(i=>i.name);
    this.recipePrompt.ingredients = ingredientStrings;
    console.log(`ingredients change ${filteredIngredients}`);
  }

getServingStyles(){
  return this.options.filter(o=>o.type == "serving")
}

getCulinaryStyles(){
  return this.options.filter(o=>o.type == "culinary-style")
}

getDirectives(){
  return this.options.filter(o=>o.type == "directive")
}


  
randomizeSurprise(){
  if (this.recipePrompt.type === 'surprise-me'){
    const surprise = this.recipePrompt as SurpriseRecipe;
    const mvp: MVP = this.randomElement(this.mvps);
    console.log(mvp);
    surprise.mvp = `${mvp.productName} by ${mvp.companyName}`;
    surprise.serving = this.randomElement(this.getServingStyles()).prompt;
    surprise.style = this.randomElement(this.getCulinaryStyles()).prompt;
    surprise.directive = this.randomElement(this.getDirectives()).prompt;
  }
  
}

randomElement<T>(arg: T[]): T{
  if (this.mvps.length === 0) {
    throw new Error('The MVP array is empty.');
  }
  const randomIndex = Math.floor(Math.random() * this.mvps.length);
  return arg[randomIndex];
}
  
generateRecipe(){
  console.log("GENERATING");
  if (this.recipePrompt.type === 'surprise-me'){
    this.randomizeSurprise();
  }
  let body = JSON.stringify(this.recipePrompt);
  console.log(body);
  this.postRecipe(this.recipePrompt);
}

postRecipe(body:any){
  this.http.post(environment.generateUrl,
    body
  ).subscribe({
    next: jsonData => {
      console.log('JSON Data loaded', jsonData);
      this.recipe = jsonData;
      this.scrollToSection(this.stateMachine.showNextSection('generating'));
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
  
  
  scrollToSection(sectionID: string | null) {
    console.log(`scrollToSection ${sectionID}`);
    if (sectionID){
      const child = this.sections.find(section=>section.sectionID === sectionID);
      if (child){
        setTimeout(() => {
          child.getElementRef().nativeElement.scrollIntoView({ behavior: 'smooth' });
        }, 100); // 1000 milliseconds = 1 second
        
      }

    }
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

  
 
  
  /*foodForests = [
    { id: 1, name: 'Amsterdam Food', enabled: true },
    { id: 2, name: 'Mandius Food Forest', enabled: true  },
    { id: 3, name: 'Food Forest Pantry', enabled: true  },
  ]*/

  
  
  ingredients: Ingredient[] = [
    { id: 1, name: 'Yarrow', enabled: true, available:true, description:"" },
    { id: 2, name: 'Sweet Chestnut', enabled: true , available:true, description:"" },
    { id: 3, name: 'Daylillies', enabled: true , available:true , description:""},
  ]
  
  recipePrompt: SurpriseRecipe | PreservedRecipe = {
    type: 'surprise-me',
    ingredients: [],
    mvp: 'None',
    style: 'None',
    serving: 'home'
  } as SurpriseRecipe;
  
  recipe!: Object;

  
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
