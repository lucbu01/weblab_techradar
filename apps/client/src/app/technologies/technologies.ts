import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatHeaderRowDef, MatTableModule } from '@angular/material/table';
import { Technology } from '@techradar/libs';
import { TechnologyApi } from '../technology-api';
import { Category } from '../chips/category';
import { Ring } from '../chips/ring';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import type { EditMode } from '../technology-edit/technology-edit';
import { MatChipsModule } from '@angular/material/chips';
import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { debounceTime, Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Auth } from '../auth/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { TechnologyDetail } from '../technology-detail/technology-detail';

@Component({
  selector: 'techradar-technologies',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTableModule,
    Category,
    Ring,
    MatHeaderRowDef,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
    CdkFixedSizeVirtualScroll,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class Technologies implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly auth = inject(Auth);
  private readonly technologyApi = inject(TechnologyApi);

  private readonly subscriptions: Subscription[] = [];
  private dialogRef?: MatDialogRef<TechnologyDetail>;
  protected readonly searchForm = this.formBuilder.group({
    name: [''],
    category: [],
    ring: [],
    published: ['all'],
  });

  protected readonly technologies = signal<Technology[]>([]);
  protected readonly user = toSignal(this.auth.getUserInfo());
  protected readonly filter = signal(true);

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

  private loadTechnologies() {
    const search = this.searchForm.value;
    this.technologyApi
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
    this.technologyApi.deleteTechnology(technology.id).subscribe(() => {
      this.loadTechnologies();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
