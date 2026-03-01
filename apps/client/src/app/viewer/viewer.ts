import { Component, inject, OnInit, signal } from '@angular/core';
import { TechnologyService } from '../technology.service';
import {
  Technology,
  TechnologyCategory,
  TechnologyRing,
} from '@techradar/libs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'techradar-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatTooltip,
  ],
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class Viewer implements OnInit {
  private technologyService = inject(TechnologyService);
  technologies = signal<Technology[]>([]);

  ngOnInit() {
    this.technologyService.getTechnologies(true).subscribe((techs) => {
      this.technologies.set(techs);
    });
  }

  getPoint(tech: Technology): { x: number; y: number } {
    const center = 400;
    const radius = this.getRadius(tech.ring);
    const angle = this.getAngle(tech.category, tech.id);

    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  }

  private getRadius(ring?: TechnologyRing): number {
    switch (ring) {
      case 'ADOPT':
        return 40;
      case 'TRIAL':
        return 130;
      case 'ASSESS':
        return 230;
      case 'HOLD':
        return 330;
      default:
        return 350;
    }
  }

  private getAngle(category: TechnologyCategory, id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    const offset = (Math.abs(hash) % 80) / 100 + 0.1;

    switch (category) {
      case 'TECHNIQUES':
        return -Math.PI / 2 + offset * (Math.PI / 2); // Nord-Ost
      case 'PLATFORMS':
        return offset * (Math.PI / 2); // Süd-Ost
      case 'TOOLS':
        return Math.PI / 2 + offset * (Math.PI / 2); // Süd-West
      case 'LANGS_FRAMEWORKS':
        return Math.PI + offset * (Math.PI / 2); // Nord-West
      default:
        return 0;
    }
  }
}
