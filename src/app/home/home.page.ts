import { Component, QueryList, ViewChildren, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Import environment
import { SectionComponent } from '../sections/section.component';
import { SectionService } from '../sections/section.service';
import { SurpriseRecipe, PreservedRecipe, FreshByTypology, FreshByProduct, BasicRecipe, IngredientList, Ingredient, FoodForest, MVP, RecipeOption, PromptTemplate } from '../recipe.interfaces';
import { DataService } from '../data.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements AfterViewInit, OnInit {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChildren(SectionComponent) sections!: QueryList<SectionComponent>;
  
  
  constructor(private animationCtrl: AnimationController,
    private http: HttpClient,
    private sectionService: SectionService,
    private dataService: DataService) {
      sectionService.addEventHandler((next:string)=>this.scrollToSection(next));
  }
  
  
  ngAfterViewInit() {

  }
  
  ngOnInit() {
    // FIXME need to elegantly handle failure to load parameters.
    // Also move httpclient to the dataService.
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
  if (arg.length === 0) {
    throw new Error('The array is empty.');
  }
  const randomIndex = Math.floor(Math.random() * arg.length);
  return arg[randomIndex];
}

requestRecipeData(){
  this.dataService.generateRecipe();
}
  
generateRecipe(){
  console.log("GENERATING");
  if (this.recipePrompt.type === 'surprise-me'){
    this.randomizeSurprise();
  }
  this.recipeJson = JSON.stringify(this.recipePrompt);
  console.log(this.recipeJson);
  this.dataService.generateRecipe();
  // manually show next and scroll
  this.sectionService.showSection('recipe');
  //this.scrollToSection('recipe');
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
*/
  
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
    
  }
  
  
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
  
  recipeJson!: string;
  
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
