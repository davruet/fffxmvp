import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'image-accordion',
  templateUrl: './image-accordion.component.html',
  styleUrls: ['./image-accordion.component.scss'],
})
export class ImageAccordionComponent  implements OnInit {
  
  @Input() items: any[] = [];


  constructor() { }

  ngOnInit() {}
  
  toggleItemEnabled(item: any, event:Event): void {
    event.stopPropagation();
    item.enabled = !item.enabled;
    console.log(`Task ${item.name} completion status: ${item.enabled}`);
  }


}
