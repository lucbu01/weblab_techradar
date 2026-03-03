import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TechnologyService } from '../technology.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';
import { Ring } from '../chips/ring';
import { Category } from '../chips/category';
import { Auth } from '../auth/auth';

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
export class TechnologyDetail {
  private data: { id: string } = inject(MAT_DIALOG_DATA);
  private technologyService = inject(TechnologyService);
  protected technology = toSignal(
    this.technologyService.getTechnologyById(this.data.id),
  );
  private auth = inject(Auth);
  protected user = toSignal(this.auth.getUserInfo());
}
