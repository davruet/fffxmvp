import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from './image.service';

@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css']
})
export class ImageGeneratorComponent implements OnInit {
  @Input() prompt!: string;
  isLoading = true;
  imageSrc: string | null = null;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    if (this.prompt) {
      this.fetchImage(this.prompt);
    }
  }

  ngOnChanges(): void {
    if (this.prompt) {
      this.isLoading = true;
      this.fetchImage(this.prompt);
    }
  }

  private fetchImage(prompt: string): void {
    this.imageService.generateImage(prompt).subscribe({
      next: (base64Image) => {
        this.imageSrc = `data:image/png;base64,${base64Image}`;
        this.isLoading = false;
      },
      error: () => {
        this.imageSrc = null;
        this.isLoading = false;
      }
    });
  }
}