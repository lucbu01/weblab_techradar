import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'techradar-ring',
  imports: [MatChipsModule],
  templateUrl: './ring.html',
  styleUrl: './ring.scss',
})
export class Ring {
  public readonly ring = input<string>();
  protected readonly class = computed(
    () => `chip-${this.ring()?.toLowerCase()}`,
  );
}
