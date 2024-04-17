import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ItemListComponent } from '../item-list/item-list.component';
import { ImageAccordionComponent } from '../image-accordion/image-accordion.component';
import { HttpClientModule } from '@angular/common/http';


import { HomePageRoutingModule } from './home-routing.module';
import { SectionComponent } from '../sections/section.component';
import { SectionService } from '../sections/section.service';
import { ChoiceSectionComponent } from '../sections/choice-section.component';
import { ImageGeneratorComponent } from '../image/image-generator.component';
import { DataFetcherComponent } from '../data-fetcher.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule,
  ],
  declarations: [HomePage, ItemListComponent, ImageAccordionComponent, SectionComponent, ChoiceSectionComponent, ImageGeneratorComponent, DataFetcherComponent]
})
export class HomePageModule {}
