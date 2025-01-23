import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
   styleUrl: './confirmation.component.scss'

})
export class ConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);  // Closes the dialog and sends 'false' to the caller
  }

  onConfirm(): void {
    this.dialogRef.close(true);  // Closes the dialog and sends 'true' to the caller
  }
}
