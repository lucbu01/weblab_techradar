import { Component, computed, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TechnologyApi } from '../technology-api';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { Category } from '../chips/category';
import { Ring } from '../chips/ring';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDivider } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CreateTechnology,
  TechnologyCategory,
  TechnologyRing,
} from '@techradar/libs';

export type EditMode = 'create' | 'publish' | 'edit' | 'classify';

@Component({
  selector: 'techradar-technology-edit',
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatChipSet,
    Category,
    Ring,
    MatChip,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatDialogClose,
    MatDivider,
    MatError,
  ],
  templateUrl: './technology-edit.html',
  styleUrl: './technology-edit.scss',
})
export class TechnologyEdit {
  protected data: { id?: string; mode: EditMode } = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<TechnologyEdit>);
  private snackBar = inject(MatSnackBar);
  private technologyService = inject(TechnologyApi);
  private formBuilder = inject(FormBuilder);
  protected technology = toSignal(
    this.data.id
      ? this.technologyService.getTechnologyById(this.data.id)
      : of(undefined),
  );
  protected actionLabel = this.getActionLabel();
  protected formGroup = computed(() => {
    const technology = this.technology();
    const group: { [key: string]: Array<string | Array<ValidatorFn>> } = {};
    if (['create', 'edit'].includes(this.data.mode)) {
      group['name'] = [technology?.name || '', [Validators.required]];
      group['category'] = [technology?.category || '', [Validators.required]];
      group['description'] = [
        technology?.description || '',
        [Validators.required],
      ];
    }
    if (['create', 'publish', 'classify'].includes(this.data.mode)) {
      group['ring'] = [
        technology?.ring || '',
        [
          this.data.mode !== 'edit'
            ? this.requiredIfPublishing
            : Validators.required,
        ],
      ];
      group['classificationDescription'] = [
        technology?.classificationDescription || '',
        [
          this.data.mode !== 'edit'
            ? this.requiredIfPublishing
            : Validators.required,
        ],
      ];
    }
    return this.formBuilder.group(group, {
      validators: this.fullFormValidator as ValidatorFn,
    });
  });

  private requiredIfPublishing: ValidatorFn = (control) => {
    const result = Validators.required(control);
    if (result?.['required']) {
      return { publishing: true };
    }
    return null;
  };

  private fullFormValidator = (group: FormGroup) => {
    const errors: { [key: string]: boolean } = {};
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control?.errors) {
        Object.assign(errors, control.errors);
      }
    });
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 1 && errors?.['publishing']) {
      return { draft: true };
    } else if (errorKeys.length > 1) {
      return errors;
    }
    return null;
  };

  private getActionLabel() {
    switch (this.data.mode) {
      case 'create':
        return 'erstellen';
      case 'publish':
        return 'publizieren';
      case 'edit':
        return 'bearbeiten';
      case 'classify':
        return 'klassifizieren';
    }
  }

  protected onSubmit(event: SubmitEvent) {
    const formValue = this.formGroup().value as Partial<CreateTechnology>;
    switch (this.data.mode) {
      case 'create': {
        const published = event.submitter?.getAttribute('value') === 'publish';
        this.technologyService
          .createTechnology({
            name: formValue.name as string,
            category: formValue.category as TechnologyCategory,
            description: formValue.description as string,
            ring: formValue.ring,
            classificationDescription: formValue.classificationDescription,
            published,
          })
          .subscribe((tech) => {
            this.dialogRef.close(tech);
            this.snackBar.open(
              'Technologie erfolgreich erstellt',
              'Schließen',
              {
                duration: 3000,
              },
            );
          });
        break;
      }
      case 'publish': {
        this.technologyService
          .publishTechnology(this.data.id as string, {
            ring: formValue.ring as TechnologyRing,
            classificationDescription:
              formValue.classificationDescription as string,
          })
          .subscribe((tech) => {
            this.dialogRef.close(tech);
            this.snackBar.open(
              'Technologie erfolgreich publiziert',
              'Schließen',
              {
                duration: 3000,
              },
            );
          });
        break;
      }
      case 'edit':
        this.technologyService
          .updateTechnology(this.data.id as string, {
            name: formValue.name as string,
            category: formValue.category as TechnologyCategory,
            description: formValue.description as string,
          })
          .subscribe((tech) => {
            this.dialogRef.close(tech);
            this.snackBar.open(
              'Technologie erfolgreich geändert',
              'Schließen',
              {
                duration: 3000,
              },
            );
          });
        break;
      case 'classify':
        this.technologyService
          .upsertTechnologyClassification(this.data.id as string, {
            ring: formValue.ring as TechnologyRing,
            classificationDescription:
              formValue.classificationDescription as string,
          })
          .subscribe((tech) => {
            this.dialogRef.close(tech);
            this.snackBar.open(
              'Technologie erfolgreich neu klassifiziert',
              'Schließen',
              {
                duration: 3000,
              },
            );
          });
    }
  }
}
