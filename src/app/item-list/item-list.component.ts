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
