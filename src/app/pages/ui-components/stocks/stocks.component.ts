import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-stocks',
  standalone: false,
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss'
})
export class StocksComponent implements OnInit{
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
   currentPage:number=1;
   totalItems:number=0;
     totalPage: number = 0;
   pageSize:number=10;
   paginatedData:any[]=[];

   displayedColumns: string[] = ['sno', 'group_name','material_name','material_unit','material_description','transaction_date','opening_qty','purchase_qty','sale_qty','closing_qty'];
   dataSource: MatTableDataSource<any> = new MatTableDataSource();
  StockForm!: FormGroup;
  noData: boolean= false;

  stock:any[]=[];

  constructor(
    private cookieService: CookieService,
    private stockService:StockService,
    private toastr: ToastrService,
    private router: Router

  ) { }
  ngOnInit(): void {
    const token = this.cookieService.get('token');

    this.StockForm = new FormGroup({
      key: new FormControl(token),
      type: new FormControl('select'),
      _date:new FormControl(''),
    })

    }


    submit(){
      this.getStockData()
    }


    getStockData() {


      let params = new HttpParams()
    .set('key', this.StockForm.get('key')?.value)
    .set('type', this.StockForm.get('type')?.value)
    .set('_date', this.StockForm.get('_date')?.value)



      this.stockService.getStock(params.toString()).subscribe(
        (response: any) => {
          if (response.status === 'success') {
              this.stock = response.data?.data1 || [];
              this.pagination()
              this.dataSource.data = this.stock;
              console.log("Material group  new is ",this.dataSource.data,"andother is ",this.stock)


              console.log("stock items is ", this.stock);
              if(this.stock && this.stock.length <=0){
                this.noData= true;
              }else{
                this.noData = false;
              }

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


    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

      // Set the filterPredicate before applying the filter
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const materialName = data.material_name ? data.material_name.toLowerCase() : ''; // Correct key names
        const materialGroup = data.group_name ? data.group_name.toLowerCase() : ''; // Correct key names
        const QTY = data.qty ? data.qty.toLowerCase() : '';
        const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
        return materialName.includes(filter) || materialGroup.includes(filter)  || QTY.includes(filter)|| materialUnit.includes(filter);
      };

      // Apply the filter
      this.dataSource.filter = filterValue;
    }

    onPageChange(event: any) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.paginateData();
    }

    paginateData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.dataSource.data.slice(startIndex, endIndex);
      this.totalPage = Math.ceil(this.dataSource.data.length / this.pageSize);
    }

    onSortData(sort: any) {
      this.paginatedData = this.paginatedData.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'group_name':
            return this.compare(a.group_name, b.group_name, isAsc);
          case 'created_at':
            return this.compare(a.created_at, b.created_at, isAsc);
          default:
            return 0;
        }
      });
      this.dataSource.data = this.paginatedData;
    }

    compare(a: string | number, b: string | number, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    pagination(){
      const startIndex = (this.currentPage -1)* this.pageSize;
      const endIndex = startIndex+this.pageSize;
      this.paginatedData = this.stock.slice(startIndex,endIndex)
    }




  }





