
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
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
