import { Component, Input, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { BasicRecipe } from './recipe.interfaces';

@Component({
  selector: 'app-data-fetcher',
  template: `<div [ngStyle]="styles" [innerHTML]= "dataStream"></div>`,
})
export class DataFetcherComponent implements OnInit {
  dataStream: string = '';

  constructor(private dataService: DataService) {}
  
  @Input() requestObject!: any;
  @Input() styles: any;
  
  ngOnInit() {
    this.dataService.getGenerateRecipeTrigger().subscribe(() => {
      this.dataStream = ''; // clear old recipe.
      this.dataService.postRecipe(this.requestObject).subscribe({
        next: partialHTML => {
          this.dataStream += partialHTML;
        },
        error: (error) => console.error('Error fetching data:', error),
      });
    });
  }
}