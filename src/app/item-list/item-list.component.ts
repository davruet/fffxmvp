import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent  implements OnInit {
  
  @Input() items: any[] = [];
  
  constructor() { }

  ngOnInit() {}
  
  toggleItemEnabled(item: any): void {
    item.enabled = !item.enabled;
    console.log(`Task ${item.name} completion status: ${item.enabled}`);
  }

}
