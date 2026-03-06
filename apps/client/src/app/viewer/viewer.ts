import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TechnologyApi } from '../technology-api';
import { TechnologyList } from '@techradar/libs';
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
import type { TechnologyDetail } from '../technology-detail/technology-detail';
import { MatFabButton } from '@angular/material/button';
import { Ring } from '../chips/ring';
import { Auth } from '../auth/auth';
import { toSignal } from '@angular/core/rxjs-interop';

interface TechnologyWithPosition extends TechnologyList {
  x: number;
  y: number;
}

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
    MatFabButton,
    RouterLink,
    Ring,
  ],
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class Viewer implements OnInit, OnDestroy {
  private readonly technologyService = inject(TechnologyApi);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(Auth);

  private readonly subscriptions: Subscription[] = [];
  private dialogRef?: MatDialogRef<TechnologyDetail>;

  readonly user = toSignal(this.auth.getUserInfo());
  readonly technologies = signal<TechnologyWithPosition[]>([]);
  readonly hoveredId = signal<string | null>(null);
  readonly hoveredTech = computed(() => {
    const id = this.hoveredId();
    return this.technologies().find((t) => t.id === id);
  });

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
    this.dialog
      .open(c.TechnologyEdit, {
        data: { mode: 'create' },
        width: '600px',
        maxWidth: 600,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe(() => this.loadTechnologies());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private loadTechnologies() {
    this.technologyService.getTechnologies(true).subscribe((techs) => {
      this.technologies.set(this.addPosition(techs));
    });
  }

  private addPosition(techs: TechnologyList[]): TechnologyWithPosition[] {
    const placedPoints: { x: number; y: number; r: number }[] = [];
    const minDistance = 24; // 10px Radius * 2 + 4px Puffer
    const maxAttempts = 500;

    const sortedForPlacement = [...techs].sort((a, b) =>
      a.id.localeCompare(b.id),
    ) as TechnologyWithPosition[];

    // Einfacher deterministischer Pseudo-Zufallsgenerator (LCG)
    // So sieht das Radar bei gleichen Daten immer exakt gleich aus.
    let seed = 1337;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const randomPos = (bounds: {
      minR: number;
      maxR: number;
      minA: number;
      maxA: number;
    }) => {
      const r2 =
        random() * (bounds.maxR * bounds.maxR - bounds.minR * bounds.minR) +
        bounds.minR * bounds.minR;
      const randomRadius = Math.sqrt(r2);
      const randomAngle = bounds.minA + random() * (bounds.maxA - bounds.minA);
      return this.polarToCartesian(randomRadius, randomAngle);
    };

    for (const tech of sortedForPlacement) {
      const bounds = this.getBounds(tech.ring, tech.category);
      let placed = false;

      // Versuche eine freie Position zu finden
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Flächenkorrekte Verteilung im Donut-Segment
        const point = randomPos(bounds);

        // Prüfen, ob der Punkt zu nah an einem bereits platzierten Punkt liegt
        const hasCollision = placedPoints.some((p) => {
          const dx = p.x - point.x;
          const dy = p.y - point.y;
          return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });

        if (!hasCollision) {
          placedPoints.push({ ...point, r: 10 });
          tech.x = point.x;
          tech.y = point.y;
          placed = true;
          break;
        }
      }

      // Fallback, falls der Ring komplett voll ist (erzwingt Platzierung mit minimaler Überschneidung)
      if (!placed) {
        const point = randomPos(bounds);

        placedPoints.push({ ...point, r: 10 });
        tech.x = point.x;
        tech.y = point.y;
      }
    }

    return sortedForPlacement;
  }

  private getBounds(
    ring: string | undefined,
    category: string,
  ): { minR: number; maxR: number; minA: number; maxA: number } {
    // Radien-Grenzen (inkl. Puffer zu den SVG-Kreisen r: 80, 180, 280, 380)
    let minR = 380,
      maxR = 400;
    switch (ring) {
      case 'ADOPT':
        minR = 20;
        maxR = 65;
        break;
      case 'TRIAL':
        minR = 100;
        maxR = 165;
        break;
      case 'ASSESS':
        minR = 200;
        maxR = 265;
        break;
      case 'HOLD':
        minR = 300;
        maxR = 365;
        break;
    }

    // Winkel-Grenzen (in Radiant, 0 ist rechts, Pi/2 ist unten)
    const padding = 0.15; // ca. 8,5 Grad Abstand zu den Fadenkreuz-Linien
    let minA, maxA;

    switch (category) {
      case 'TECHNIQUES': // Oben Rechts
        minA = -Math.PI / 2 + padding;
        maxA = 0 - padding;
        break;
      case 'PLATFORMS': // Unten Rechts
        minA = padding;
        maxA = Math.PI / 2 - padding;
        break;
      case 'TOOLS': // Unten Links
        minA = Math.PI / 2 + padding;
        maxA = Math.PI - padding;
        break;
      case 'LANGS_FRAMEWORKS': // Oben Links (SVG Y-Achse ist invertiert)
        minA = -Math.PI + padding;
        maxA = -Math.PI / 2 - padding;
        break;
      default:
        minA = 0;
        maxA = Math.PI * 2;
    }

    return { minR, maxR, minA, maxA };
  }

  private polarToCartesian(
    radius: number,
    angle: number,
  ): { x: number; y: number } {
    const center = 400;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  }
}
