import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';




@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class StocksComponent implements OnInit,AfterViewInit{
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


   paginatedData:any[]=[];
   stock:any[]=[];


   displayedColumns: string[] = ['sno', 'group_name','material_name','material_unit','material_description','transaction_date','opening_qty','purchase_qty','sale_qty','closing_qty'];
  dataSource = new MatTableDataSource<any>([]);
  StockForm!: FormGroup;
  noData: boolean= false;


  constructor(
    private cookieService: CookieService,
    private stockService:StockService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const token = this.cookieService.get('token');

    this.StockForm = new FormGroup({
      key: new FormControl(token),
      type: new FormControl('select'),
      start_date:new FormControl(formattedDate),
      end_date:new FormControl(formattedDate),
    })



      this.getStockData()

    }



    ngAfterViewInit() {
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },100);
    }



    submit(){
      this.getStockData()
    }


    getStockData() {

      if(!this.StockForm.get('start_date')?.value && !this.StockForm.get('end_date')?.value){
        this.toastr.error('Please select start and end date')
        return;
      }


      let params = new HttpParams()
    .set('key', this.StockForm.get('key')?.value)
    .set('type', this.StockForm.get('type')?.value)
    .set('start_date', this.StockForm.get('start_date')?.value)
    .set('end_date', this.StockForm.get('end_date')?.value)



      this.stockService.getStock(params.toString()).subscribe(
        (response: any) => {
          if (response.status == 'success') {
              this.stock = response.data?.data1 || [];
              this.dataSource.data = this.stock;
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.noData = this.stock.length === 0;


          } else if(response.message[0].status == 101){
            this.cookieService.delete('userId');
        this.cookieService.delete('userName');
        this.cookieService.delete('userType');
        this.cookieService.delete('token');
        this.router.navigate(['/authentication/login']);

          }else {
            this.toastr.error('Failed to retrieve data');
          }
        },
        (error: any) => {
          console.log('Error:', error);
          this.toastr.error(error.statusText);
        }
      );
    }

    exportAsCSV(): void {
      const csvData = this.createCSV(this.stock);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'daily_stock_report.csv';
      link.click();
    }

    createCSV(data: any[]): string {
      // Define the headerd
      const header = ['SNo', 'Material Group', 'Material Name', 'UOM','Material Description','Transaction Date','Opening Qty','Purchase Qty','Sale Qty','Closing Qty'];

      const rows = data.map((item,index) => [
        index+1,
        item.group_name,
        item.material_name,
        item.material_unit,
        item.material_description,
        item.transaction_date,
        item.opening_qty,
        item.purchase_qty,
        item.sale_qty,
        item.closing_qty
      ]);

      const csvContent = [
        header.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csvContent;
    }



    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const materialName = data.material_name ? data.material_name.toLowerCase() : '';
        const materialGroup = data.group_name ? data.group_name.toLowerCase() : '';
        const QTY = data.qty ? data.qty.toLowerCase() : '';
        const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
        return materialName.includes(filter) || materialGroup.includes(filter)  || QTY.includes(filter)|| materialUnit.includes(filter);
      };

      this.dataSource.filter = filterValue;
    }

      onPageChange(event: any): void {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getStockData();
  }




  }




