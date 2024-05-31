/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'image-accordion',
  templateUrl: './image-accordion.component.html',
  styleUrls: ['./image-accordion.component.scss'],
})
export class ImageAccordionComponent  implements OnInit {
  
  @Input() items: any[] = [];
  @Output() changeDetected = new EventEmitter<any[]>();


  constructor() { }

  ngOnInit() {}
  
  toggleItemEnabled(item: any, event:Event): void {
    event.stopPropagation();
    item.enabled = !item.enabled;
    console.log(`Task ${item.name} completion status: ${item.enabled}`);
  }

  onToggleChange(item: any): void {
    console.log(`Item ${item.name} enabled status: ${item.enabled}`);
    this.changeDetected.emit(this.items);  // Emitting the item that was changed
  }
  
  onToggleClicked(event:MouseEvent):void{
    event.stopPropagation();
  }/*
  onHeaderClicked(event:MouseEvent):void{
    event.stopPropagation();
  }*/
  
  
  clickEvent(event:MouseEvent){
    this.changeDetected.emit(this.items);

    const target = event.target as HTMLElement;
    if (target.tagName === "ION-TOGGLE"){
      event.stopPropagation();
    }
  }



}
