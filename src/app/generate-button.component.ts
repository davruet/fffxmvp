/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */

import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-generate-data',
  template: `<button (click)="triggerDataFetch()">Generate Data</button>`,
})
export class GenerateDataComponent {

  constructor(private dataService: DataService) {}

  triggerDataFetch() {
    this.dataService.generateRecipe(); // Trigger the fetch process
  }
}