

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import * as Papa from 'papaparse';
import { HttpParams } from '@angular/common/http';
import { StockService } from 'src/app/services/stock/stock.service';
import { CsvdownloadService } from 'src/app/services/csvdownload.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ThemeService } from 'ng2-charts';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-initial-stock',
  templateUrl: './initial-stock.component.html',
  styleUrl: './initial-stock.component.scss'
})
export class InitialStockComponent implements OnInit,AfterViewInit{
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    displayedColumns: string[] = ['sno', 'group_name', 'material_name', 'material_unit','qty','transition_date'];


    dataSource = new MatTableDataSource<any>([]);




  selectedFile: File | null = null;
  parsedData: any[] = [];
  export: any[] = [];
key:any;
errorData:any[] = [];

    constructor(
      private cookieService: CookieService,
      private toastr: ToastrService,
      private stockService:StockService,
      private csvDownloadService:CsvdownloadService,
      private router: Router

    ) { }

    ngOnInit(): void {
      this.key = this.cookieService.get('token');
      this.exportData();

    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const materialName = data.material_name ? data.material_name.toLowerCase() : '';
      const materialGroup = data.group_name ? data.group_name.toLowerCase() : '';
      const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
      return materialName.includes(filter) || materialGroup.includes(filter) ||  materialUnit.includes(filter);;
    };

    this.dataSource.filter = filterValue;
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
            if(response?.data?.data1?.errors?.length >0){
              this.errorData=response?.data?.data1?.errors;
            }else{
              this.errorData=[]
            }
            this.toastr.success('File uploaded successfully');

            this.exportData();


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


    exportAsCSV(): void {
      const csvData = this.createCSV(this.export);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'intialStock.csv';
      link.click();
    }

    createCSV(data: any[]): string {
      const header = ['SNo', 'Material Group', 'Material Name','Quantity', 'UOM'];

      const rows = data.map((item,index) => [
        index+1,
        item.group_name,
        item.material_name,
        item.qty,
        item.material_unit
      ]);

      const csvContent = [
        header.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csvContent;
    }


    exportData(): void {

      const formData = new FormData();
      formData.append('key',this.key);


      this.stockService.ExportInitialStock(formData).subscribe(
        (response: any) => {
          if (response.status === 'success') {
               this.export=response.data.data1;
               this.dataSource.data = this.export;
          }
          else if(response.message.status == 101){
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

