


import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-materialgrp-conf',
  templateUrl: './materialgrp-conf.component.html',
  styleUrl: './materialgrp-conf.component.scss'
})
export class MaterialgrpConfComponent {
  constructor(public dialogRef: MatDialogRef<MaterialgrpConfComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

