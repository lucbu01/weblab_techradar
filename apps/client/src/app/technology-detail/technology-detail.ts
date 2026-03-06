import { Component, inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TechnologyApi } from '../technology-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';
import { Ring } from '../chips/ring';
import { Category } from '../chips/category';
import { Auth } from '../auth/auth';
import type { EditMode } from '../technology-edit/technology-edit';
import { Technology } from '@techradar/libs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'techradar-technology-detail',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatChipSet,
    MatChip,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    Ring,
    Category,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './technology-detail.html',
  styleUrl: './technology-detail.scss',
})
export class TechnologyDetail implements OnInit {
  private readonly data: { id: string } = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly technologyService = inject(TechnologyApi);
  private readonly auth = inject(Auth);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly smallerButtons = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(map((result) => result.matches)),
  );
  protected readonly technology = signal<Technology | undefined>(undefined);
  protected readonly user = toSignal(this.auth.getUserInfo());

  ngOnInit() {
    this.technologyService
      .getTechnologyById(this.data.id)
      .subscribe((technology) => this.technology.set(technology));
  }

  async openEditDialog(mode: EditMode) {
    const c = await import('../technology-edit/technology-edit');
    this.dialog
      .open(c.TechnologyEdit, {
        data: { id: this.data.id, mode },
        width: '600px',
        maxWidth: 600,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe((technology: Technology) => this.technology.set(technology));
  }

  deleteTechnology() {
    this.technologyService.deleteTechnology(this.data.id).subscribe(() => {
      this.dialog.closeAll();
    });
  }
}
