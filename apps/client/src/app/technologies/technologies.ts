import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { Technology } from '@techradar/libs';
import { TechnologyService } from '../technology.service';
import { Category } from '../chips/category';
import { Ring } from '../chips/ring';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import type { EditMode } from '../technology-edit/technology-edit';
import { MatChip } from '@angular/material/chips';
import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { debounceTime } from 'rxjs';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';

@Component({
  selector: 'techradar-technologies',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    Category,
    Ring,
    MatHeaderRowDef,
    MatFabButton,
    MatIcon,
    MatTooltip,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatChip,
    CdkFixedSizeVirtualScroll,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class Technologies implements OnInit {
  private dialog = inject(MatDialog);
  private formBuilder = inject(FormBuilder);
  protected searchForm = this.formBuilder.group({
    name: [''],
    category: [],
    ring: [],
    published: ['all'],
  });

  protected readonly technologies = signal<Technology[]>([]);
  private technologyService = inject(TechnologyService);

  protected readonly displayedColumns: string[] = [
    'name',
    'category',
    'ring',
    'actions',
  ];

  ngOnInit() {
    this.loadTechnologies();
    this.searchForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.loadTechnologies());
  }

  private loadTechnologies() {
    const search = this.searchForm.value;
    this.technologyService
      .getTechnologies(
        search.published === 'all'
          ? undefined
          : (search.published as unknown as boolean),
        search.name?.trim() === '' ? undefined : search.name?.trim(),
        search.category as unknown as string[],
        search.ring as unknown as string[],
      )
      .subscribe((techs) => {
        this.technologies.set(techs);
      });
  }

  async openDetailDialog(technology: Technology) {
    const c = await import('../technology-detail/technology-detail');
    this.dialog
      .open(c.TechnologyDetail, {
        data: { id: technology.id },
        width: '600px',
        maxWidth: 600,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe(() => this.loadTechnologies());
  }

  async openEditDialog(mode: EditMode, technology: Technology) {
    const c = await import('../technology-edit/technology-edit');
    this.dialog
      .open(c.TechnologyEdit, {
        data: { id: technology.id, mode },
        width: '600px',
        maxWidth: 600,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe(() => this.loadTechnologies());
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

  deleteTechnology(technology: Technology) {
    this.technologyService.deleteTechnology(technology.id).subscribe(() => {
      this.loadTechnologies();
    });
  }
}
