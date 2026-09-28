import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateTeam, SupportLevel } from '../../core/models/team.model';

export interface TeamFormDialogData {
  mode: 'create' | 'edit';
  initial?: Partial<CreateTeam>;
}

@Component({
    selector: 'app-team-form-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
    ],
    templateUrl: './team-form-dialog.component.html'
})
export class TeamFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<TeamFormDialogComponent>);
  readonly data: TeamFormDialogData = inject(MAT_DIALOG_DATA);

  readonly supportLevels: SupportLevel[] = ['platinum', 'gold', 'standard'];

  readonly form = this.fb.nonNullable.group({
    slug: [
      this.data.initial?.slug ?? '',
      [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)],
    ],
    name: [this.data.initial?.name ?? '', Validators.required],
    description: [this.data.initial?.description ?? ''],
    supportLevel: [
      (this.data.initial?.supportLevel ?? 'platinum') as SupportLevel,
    ],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.getRawValue());
  }

  cancel(): void {
    this.ref.close();
  }
}
