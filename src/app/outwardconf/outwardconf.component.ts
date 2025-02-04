import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-outwardconf',
  templateUrl: './outwardconf.component.html',
  styleUrl: './outwardconf.component.scss'
})
export class OutwardconfComponent {
  constructor(public dialogRef: MatDialogRef<OutwardconfComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);  // Closes the dialog and sends 'false' to the caller
  }

  onConfirm(): void {
    this.dialogRef.close(true);  // Closes the dialog and sends 'true' to the caller
  }
}
