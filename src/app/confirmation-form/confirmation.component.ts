import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  imports: [
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
  ],
})
export class ConfirmationComponent {
  private dialogRef = inject(MatDialogRef<ConfirmationComponent>);
  data = inject(MAT_DIALOG_DATA);

  onSubmit() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
