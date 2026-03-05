import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'techradar-category',
  imports: [MatChipsModule],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category {
  public readonly category = input<string>();
  protected readonly label = computed(() =>
    this.category() === 'LANGS_FRAMEWORKS'
      ? 'LANGUAGES & FRAMEWORKS'
      : this.category(),
  );
}
