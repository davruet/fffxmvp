import { Component, Input, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-data-fetcher',
  template: `<div [ngStyle]="styles" [innerHTML]= "dataStream"></div>`,
})
export class DataFetcherComponent implements OnInit {
  dataStream: string = '';

  constructor(private dataService: DataService) {}
  
  @Input() styles: any;
  
  ngOnInit() {
    this.dataService.getGenerateRecipeTrigger().subscribe((json) => {
      this.dataStream = ''; // clear old recipe.
      console.log("Request object: " + json);

      this.dataService.postRecipe(json).subscribe({
        next: partialHTML => {
          this.dataStream += partialHTML;
        },
        error: (error) => console.error('Error fetching data:', error),
      });
    });
  }
}