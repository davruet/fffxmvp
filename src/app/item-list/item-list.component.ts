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
  
  toggleItemEnabled(item: any): void {
    item.enabled = !item.enabled;
    console.log(`Task ${item.name} completion status: ${item.enabled}`);
    this.changeDetected.emit(this.items);
  }
  
  onToggleChange(item: any): void {
    console.log(`Item ${item.name} enabled status: ${item.enabled}`);
    this.changeDetected.emit(this.items);  // Emitting the item that was changed
  }

}
