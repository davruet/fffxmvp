/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-data-fetcher',
  template: `<div [ngStyle]="styles" [innerHTML]= "dataStream"></div>`,
})
export class DataFetcherComponent implements OnInit {
  dataStream: string = '';

  constructor(private dataService: DataService) {}
  
  @Input() styles: any;
  
  @Output() jsonExtracted = new EventEmitter<any>();

  
  ngOnInit() {
    this.dataService.getGenerateRecipeTrigger().subscribe((json) => {
      this.dataStream = ''; // clear old recipe.
      console.log("Request object: " + json);

      this.dataService.postRecipe(json).subscribe({
        next: partialHTML => {
          this.handleIncomingData(partialHTML);
        },
        error: (error) => console.error('Error fetching data:', error),
      });
    });
  }
  
  handleIncomingData(partialHTML: string) {
    const scriptTagRegex = /<script[^>]*>([\s\S]*?)<\/script>/;
    const match = scriptTagRegex.exec(partialHTML);
    
    if (match) {
      try {
        const jsonContent = match[1];
        const parsedJson = JSON.parse(jsonContent);
        this.jsonExtracted.emit(parsedJson);
        // Remove the script tag from the partial HTML
        partialHTML = partialHTML.replace(scriptTagRegex, '');
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    this.dataStream += partialHTML;
  }
}