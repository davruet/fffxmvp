import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-simple-segment',
  templateUrl: './simple-segment.component.html',
  styleUrls: ['./simple-segment.component.scss'],
})
export class SimpleSegmentComponent {
  @Input() items: string[] = []; // Input array of text items
  @Output() selectionChange = new EventEmitter<number>(); // Output event emitter

  selected: number = -1; // Currently selected item index

  constructor() { }

  selectItem(index: number): void {
    this.selected = index;
    this.selectionChange.emit(this.selected); // Emit the selected index
  }
}