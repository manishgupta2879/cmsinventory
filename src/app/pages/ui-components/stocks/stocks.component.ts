import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-stocks',
  standalone: false,
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss'
})
export class StocksComponent implements OnInit{
  StockForm!: FormGroup;
  noData: boolean= false;

  stock:any[]=[];

  constructor(
    private cookieService: CookieService,
    private stockService:StockService,
    private toastr: ToastrService,

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
            if(response.data?.data1 !==null){
              this.stock = response.data?.data1 || [];
              console.log("stock items is ", this.stock);
              this.noData= false;

            }else{
              this.stock =[];
              console.log("ohter side")
              this.noData= true;
              console.log("nodata is",this.noData)
            }


          } else {
            this.toastr.error('Failed to retrieve data');
          }
        },
        (error: any) => {
          console.log('Error:', error);
          this.toastr.error(error.statusText);
        }
      );
    }





  }





