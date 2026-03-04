import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Ring } from '../chips/ring';
import type { TechnologyDetail } from '../technology-detail/technology-detail';
import { MatFabButton } from '@angular/material/button';

@Component({
  selector: 'techradar-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterLink,
    Ring,
    MatFabButton,
  ],
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class Viewer implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private technologyService = inject(TechnologyService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private dialogRef?: MatDialogRef<TechnologyDetail>;
  technologies = signal<Technology[]>([]);

  ngOnInit() {
    this.loadTechnologies();
    this.subscriptions.push(
      this.activatedRoute.fragment.subscribe(async (id) => {
        if (this.dialogRef) {
          this.dialogRef.close();
          this.dialogRef = undefined;
          this.loadTechnologies();
        }
        if (id) {
          const c = await import('../technology-detail/technology-detail');
          this.dialogRef = this.dialog.open(c.TechnologyDetail, {
            data: { id },
            width: '600px',
            maxWidth: 600,
            restoreFocus: false,
          });
          this.dialogRef.afterClosed().subscribe(() => {
            this.router.navigate([], { fragment: '' });
          });
        }
      }),
    );
  }

  async addTechnology() {
    const c = await import('../technology-edit/technology-edit');
    this.dialog.open(c.TechnologyEdit, {
      data: { mode: 'create' },
      width: '600px',
      maxWidth: 600,
      restoreFocus: false,
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private loadTechnologies() {
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
