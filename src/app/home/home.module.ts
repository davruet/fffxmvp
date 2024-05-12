import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ItemListComponent } from '../item-list/item-list.component';
import { ImageAccordionComponent } from '../image-accordion/image-accordion.component';



import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, ItemListComponent, ImageAccordionComponent]
})
export class HomePageModule {}
