import { Component, QueryList, ViewChildren, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Import environment
import { SectionComponent } from '../sections/section.component';
import { SectionService } from '../sections/section.service';
import { SurpriseRecipe, PreservedRecipe, FreshByTypology, FreshByProduct, BasicRecipe, IngredientList, Ingredient, FoodForest, MVP, RecipeOption, PromptTemplate, FreshRecipe, AllRecipeOptions } from '../recipe.interfaces';
import { DataService } from '../data.service';
import { filterOptions, filterIngredientsByDate, filterIngredientsByFoodForest, jsonForRecipe } from '../recipe.functions';

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
      });
      // update the recipe content
      this.sectionService.addEventHandler((next: string) =>{
        switch (next) {
          case "surprise-me":
          case "fresh":
          case "typology":
          case "mvp":
            this.recipeOptions.type = next;
            break;
                
        }  
      });

  }
  
  ngOnDestroy() {

  }
  
  parameters: any;
  parametersLoading: boolean = true;
  
  foodForests: FoodForest[]= [];
  
  mvps: RecipeOption[] = [];
  
  promptTemplates: PromptTemplate[] = [];
  
  options: RecipeOption[] = [];
  
  // register functions
  filterOptions = filterOptions;
  /*
  selectedDate!: string;
  
  selectedMvp!: MVP;
  
  selectedCulinaryStyle!: RecipeOption;
  
  selectedServingStyle!: RecipeOption;
  
  selectedDirective!: RecipeOption;
  
  selectedAccommodations!: RecipeOption[];*/
  
  
    
  ingredients: Ingredient[] = [
    { id: "1", name: 'Yarrow', enabled: true, availableWeeks:"17-25", description:"", foodForest:{id:"0", name:"Food Forest 1", enabled:true} },
    { id: "2", name: 'Sweet Chestnut', enabled: true , availableWeeks:"17-25", description:"", foodForest:{id:"0", name:"Food Forest 1", enabled:true} },
    { id: "3", name: 'Daylillies', enabled: true , availableWeeks:"17-25" , description:"", foodForest:{id:"0", name:"Food Forest 1", enabled:true}},
  ]
  
  availableIngredients: Ingredient[] = this.ingredients;
  
  recipeOptions: AllRecipeOptions = {type: "surprise-me", ingredients: this.ingredients}
  
  
  initParameters(params: any){
    this.parameters = params;
    this.options = params['options'];
    this.promptTemplates = params['prompt-templates'];
    this.foodForests = params["Food Forests"].map((item:any, index: number) => {
        return {
        id: item["id"],
        name: item["NAME of FF (public)"], // Using the public name as 'name'
        enabled: true // Setting 'enabled' to true for all items
      }});
    this.mvps = filterOptions(this.options, "mvp");
    this.ingredients = this.parameters["Food Forest Ingredient"]
      .map((item:any, index: number) => {
        return {
        id: item["id"],
        name: item["ABREVIATION (20-25 ch)"], 
        enabled: true,
        description: item["20-40 WORDS"],
        imgsrc: item["PHOTO LINK"],
        sciname: item["PLANT SCI NAME (Subtitle)"],
        availableWeeks: item["AVAILABLE WEEKS"],
        foodForest: this.foodForests.find((f)=>f.name === item["FOOD FOREST"])
      }}).filter((ingredient: Ingredient)=>ingredient.foodForest);
      console.log(this.ingredients);
    

    this.handleFFChange(this.foodForests);
  }
  
  onDateChange(event: any){
    console.log('Date changed to:', event.detail.value);
    this.recipeOptions.date = new Date(event.detail.value);
    this.refreshIngredients();
    
  }
  
  refreshIngredients(){
    let available: Ingredient[] = filterIngredientsByFoodForest(this.ingredients, this.foodForests);
    if (this.recipeOptions.date){
      available = filterIngredientsByDate( available, this.recipeOptions.date);
    }
    this.availableIngredients = available;
    this.handleIngredientsChange(this.availableIngredients);
  }
  
  handleFFChange(updatedItems: any[]){
    this.refreshIngredients();
    //let validForests:FoodForest[] = this.foodForests.filter(f=>f.enabled);
    //console.log(validForests);
    
    //this.recipeOptions.ingredients = available; // FIXME do we 
    // Update available ingredients in list.
    
      //this.ingredients.splice(5);
      
      // Ingredients may have changed (no longer available)
      //this.handleIngredientsChange(this.ingredients);
  }
  
handleIngredientsChange(updatedItems: any){
    const filteredIngredients = (updatedItems as Ingredient[]).filter(i=>i.enabled);
    this.recipeOptions.ingredients = filteredIngredients
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
  if (this.recipeOptions.type === 'surprise-me'){
    const surprise = this.recipeOptions as SurpriseRecipe;
    surprise.mvp = this.randomElement(this.mvps);
    surprise.servingStyle = this.randomElement(this.getServingStyles());
    surprise.culinaryStyle = this.randomElement(this.getCulinaryStyles());
    surprise.directive = this.randomElement(this.getDirectives());
  }
}
randomizeFreshMVP(){
  this.recipeOptions.mvp = this.randomElement(filterOptions(this.options, "mvp"));
}

randomElement<T>(arg: T[]): T{
  if (arg.length === 0 || arg === null) {
    throw new Error('The array is empty.');
  }
  const randomIndex = Math.floor(Math.random() * arg.length);
  return arg[randomIndex];
}
/*
requestRecipeData(){
  this.dataService.generateRecipe();
}*/

generateRecipe(){
  console.log("GENERATING");
  console.log(this.recipeOptions)
  // Apply randomized selection to those that need it. Do this every time to allow repeated clicks/randomizations
  switch (this.recipeOptions.type){
    case 'surprise-me':
      this.randomizeSurprise();
      break;
    case 'typology':
      this.randomizeFreshMVP();
      break;
  }
 
  const recipeJson = jsonForRecipe(this.recipeOptions); // set this for the data service.
  console.log(recipeJson);
  this.dataService.generateRecipe(recipeJson);
  // manually show next and scroll
  this.sectionService.showSection('recipe');
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
  
  shouldDisableTypologyButton = ():boolean =>{
    const typology : FreshByTypology = this.recipeOptions as FreshByTypology;
    return !typology.culinaryStyle || !typology.directive || !typology.servingStyle || !typology.typology;
  }
  shouldDisablePreservedButton = ():boolean =>{
    const preserved : PreservedRecipe = this.recipeOptions as PreservedRecipe;
    return !preserved.flavor || !preserved.texture || !preserved.skill || ![preserved.timeframe];
  }
  shouldDisableMVPButton = () =>{
    const mvp : FreshByProduct = this.recipeOptions as FreshByProduct;
    return !mvp.culinaryStyle || !mvp.directive  || !mvp.servingStyle || !mvp.mvp;
  }




  /*
isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth();
    console.log(utcMonth);

    return utcYear == 2024 && (utcMonth == 3 || utcMonth == 4 || utcMonth == 5) 
  };
  */
}
