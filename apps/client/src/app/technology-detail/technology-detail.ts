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
  ],
  templateUrl: './technology-detail.html',
  styleUrl: './technology-detail.scss',
})
export class TechnologyDetail implements OnInit {
  private data: { id: string } = inject(MAT_DIALOG_DATA);
  private dialog = inject(MatDialog);
  private technologyService = inject(TechnologyApi);
  protected technology = signal<Technology | undefined>(undefined);
  private auth = inject(Auth);
  protected user = toSignal(this.auth.getUserInfo());

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
}
