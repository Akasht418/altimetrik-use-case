import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-investments-form',
  templateUrl: './investments-form.component.html',
  styleUrl: './investments-form.component.scss',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class InvestmentsFormComponent {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<InvestmentsFormComponent>);
  private datePipe = inject(DatePipe);

  addInvestmentsForm = this.formBuilder.group({
    assetType: ['', Validators.required],
    quantity: ['', [Validators.required, Validators.min(1)]],
    purchasePrice: ['', [Validators.required, Validators.min(0)]],
    date: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.addInvestmentsForm.valid) {
      const formValue = this.addInvestmentsForm.value;

      const formattedDate = this.datePipe.transform(
        formValue.date,
        'MM/dd/yyyy'
      );

      const finalFormValue = {
        ...formValue,
        date: formattedDate,
      };

      this.dialogRef.close(finalFormValue);
    } else {
      this.addInvestmentsForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
