/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent  implements OnInit {
  
  @Input() items: any[] = [];
  @Output() changeDetected = new EventEmitter<any[]>();

  
  constructor() { }

  ngOnInit() {}

  onToggleChange(): void {
    console.log("Item toggle change.");
    this.changeDetected.emit(this.items);  // Emitting the item that was changed
  }

}
