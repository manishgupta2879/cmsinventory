import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import * as Papa from 'papaparse';
import { HttpParams } from '@angular/common/http';
import { StockService } from 'src/app/services/stock/stock.service';
import { CsvdownloadService } from 'src/app/services/csvdownload.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-initial-stock',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './initial-stock.component.html',
  styleUrl: './initial-stock.component.scss'
})
export class InitialStockComponent implements OnInit{
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;


  selectedFile: File | null = null;
  parsedData: any[] = [];
key:any;

    constructor(
      private cookieService: CookieService,
      private toastr: ToastrService,
      private stockService:StockService,
      private csvDownloadService:CsvdownloadService,
      private router: Router

    ) { }

    ngOnInit(): void {
      this.key = this.cookieService.get('token')

    }


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
        },
        header: true,
      });
    };
    reader.readAsText(file);
  }


  download(): void {
    const data = [
      { 'Material Name': 'Spoons',Transaction:"2024-11-11",Quantity:3},
      { 'Material Name': 'bricks',Transaction:"2024-08-12",Quantity:4},
    ];

    this.csvDownloadService.downloadCSV(data, 'InitialStock_sample.csv');
  }



    onSubmit(): void {
      if (!this.selectedFile) {
        this.toastr.error('Please select a file to upload');
        return;
      }

      const formData = new FormData();
      formData.append('key',this.key);
      formData.append('file', this.selectedFile as File);


      this.stockService.initialStock(formData).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.toastr.success('File uploaded successfully');
            this.resetForm();

          }
          else if(response.message[0].status == 101){
                  this.cookieService.delete('userId');
              this.cookieService.delete('userName');
              this.cookieService.delete('userType');
              this.cookieService.delete('token');
              this.router.navigate(['/authentication/login']);

                }else{
            this.toastr.error('Failed to upload file');
          }
        },
        (error: any) => {
          console.error('Error:', error);
          this.toastr.error(error.statusText || 'Error uploading file');
        }
      );
    }


    resetForm(): void {
      this.selectedFile = null;
      this.fileInput.nativeElement.value = '';
    }


}
