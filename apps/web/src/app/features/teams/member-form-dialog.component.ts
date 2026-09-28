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
import { CreateTeamMember, MemberRole } from '../../core/models/team.model';

export interface MemberFormDialogData {
  mode: 'create' | 'edit';
  initial?: Partial<CreateTeamMember>;
}

@Component({
    selector: 'app-member-form-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
    ],
    templateUrl: './member-form-dialog.component.html'
})
export class MemberFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<MemberFormDialogComponent>);
  readonly data: MemberFormDialogData = inject(MAT_DIALOG_DATA);

  readonly roles: MemberRole[] = [
    'OPS Lead',
    'OPS Specialist',
    'Lead Engineer',
    'Systems Engineer',
    'Data Engineer',
    'QA Specialist',
    'Architect',
    'Analyst',
  ];

  readonly form = this.fb.nonNullable.group({
    firstName: [this.data.initial?.firstName ?? '', Validators.required],
    lastName: [this.data.initial?.lastName ?? ''],
    email: [
      this.data.initial?.email ?? '',
      [Validators.required, Validators.email],
    ],
    role: [(this.data.initial?.role ?? '') as MemberRole, Validators.required],
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
