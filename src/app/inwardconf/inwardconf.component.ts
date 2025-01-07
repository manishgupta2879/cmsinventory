


import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-inwardconf',
  templateUrl: './inwardconf.component.html',
  styleUrl: './inwardconf.component.scss'
})
export class InwardconfComponent {
  constructor(public dialogRef: MatDialogRef<InwardconfComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);  // Closes the dialog and sends 'false' to the caller
  }

  onConfirm(): void {
    this.dialogRef.close(true);  // Closes the dialog and sends 'true' to the caller
  }
}
