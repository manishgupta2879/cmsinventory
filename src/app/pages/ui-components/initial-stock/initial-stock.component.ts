import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Papa from 'papaparse';


@Component({
  selector: 'app-initial-stock',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './initial-stock.component.html',
  styleUrl: './initial-stock.component.scss'
})
export class InitialStockComponent {

  selectedFile: File | null = null;
  parsedData: any[] = [];

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const file = input.files[0];
      if (file) {
        this.selectedFile = file;
        this.parseCSV(file);
      }
    }
  }


  parseCSV(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      Papa.parse(csvData, {
        complete: (result) => {
          this.parsedData = result.data;
          console.log('Parsed Data:', this.parsedData);
        },
        header: true, // Assuming CSV has headers
      });
    };
    reader.readAsText(file);
  }

    // Handle the form submission and prepare data for API
    onSubmit(): void {
      if (this.selectedFile && this.parsedData.length > 0) {
        const payload = {
          fileName: this.selectedFile.name,
          data: this.parsedData,
        };
        console.log('Submitting payload:', payload);
        // You can make the API call here using a service to send the payload.
        // Example: this.myService.uploadStockData(payload);
      } else {
        console.error('No file selected or CSV data is empty');
      }
    }


}
