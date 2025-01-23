import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';
import { isNgTemplate } from '@angular/compiler';

interface month {
  value: string;
  viewValue: string;
}

export interface salesOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

export interface yearlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

export interface monthlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}

export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  position: string;
  productName: string;
  budget: number;
  priority: string;
}

// ecommerce card
interface productcards {
  id: number;
  imgSrc: string;
  title: string;
  price: string;
  rprice: string;
}

const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-2.jpg',
    uname: 'Andrew McDownland',
    position: 'Project Manager',
    productName: 'Real Homes Theme',
    budget: 24.5,
    priority: '50',
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-3.jpg',
    uname: 'Christopher Jamil',
    position: 'Project Manager',
    productName: 'MedicalPro Theme',
    budget: 12.8,
    priority: '25',
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-4.jpg',
    uname: 'Nirav Joshi',
    position: 'Frontend Engineer',
    productName: 'Hosting Press HTML',
    budget: 2.4,
    priority: '10',
  },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent implements OnInit,AfterViewInit {
  UserselectedYear:any=2025;
  selectProduct:any;
  materialName!: FormGroup;
  materialTableData : any[]=[];
  yearArray: number[] = [];
  selectedYear:number=2025;
  graphData:any[]=[];
  currentYear: number = new Date().getFullYear();
  yearsList: number[] = [];
  lowStock:any[]=[];
 mediumStock:any[]=[];
 highStock:any[] = [];

  public barChartData: ChartData<'bar'> = {
     labels: ['January','February','March','April','May','June','July','August','September','October','November','December'],  // X-axis labels
    datasets: [

      {
        label: 'Purchases',
        data: [],
        backgroundColor: 'rgba(40, 167, 69, 0.6)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1
      },
      {
        label: 'Sales',
        data: [],
        backgroundColor: 'rgba(0, 123, 255, 0.6)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Quantity'
        },
        beginAtZero: true
      }
    }
  };

  public barChartType: ChartType = 'bar';


  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  currentStockForm!: FormGroup;

  currentStock: any[] = [];
  public salesOverviewChart!: Partial<salesOverviewChart> | any;
  public yearlyChart!: Partial<yearlyChart> | any;
  public monthlyChart!: Partial<monthlyChart> | any;





  displayedColumns: string[] = ['sno','group_name','material_name','material_unit', 'avaqty'];
  dataSource = new MatTableDataSource<any>([]);




  constructor(
    private CurrentStockData: DashboardService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private route: Router,
    private materialnameService: MaterialnameService




  ) {


  }

  updateYearList() {
    this.yearsList = [];
    for (let year = 2025; year <= this.currentYear; year++) {
      this.yearsList.push(year);
    }
  }


  incrementYear() {
    this.currentYear += 1;
    this.updateYearList();
  }




  ngOnInit(): void {
    const token = this.cookieService.get('token');
    this.materialName = new FormGroup({
      key: new FormControl(token),
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      uom: new FormControl(''),
      des:new FormControl(''),
      type:new FormControl('select'),
      id:new FormControl('')

    });

    this.currentStockForm = new FormGroup({
      key: new FormControl(token),
      type:new FormControl('select'),
    })

    this.updateYearArray();
    this.getCurrentStock();
    this.updateYearList();

    this.showMaterialName().then(() => {
      this.getGraph();
    }).catch((error) => {
      console.error('Error in showMaterialName:', error);
    });


  }


  showMaterialName(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.materialName.patchValue({
        type: 'select',
        key: this.cookieService.get('token'),
      });

      let params = new HttpParams()
        .set('key', this.materialName.get('key')?.value)
        .set('type', this.materialName.get('type')?.value);

      this.materialnameService.getMaterialName(params.toString()).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.materialTableData = response.data?.data1 || [];
            this.selectProduct = this.materialTableData.length > 0 ? this.materialTableData[0]?.id : '';
            resolve();
          } else if (response.message[0].status === 101) {
            this.cookieService.delete('userId');
            this.cookieService.delete('userName');
            this.cookieService.delete('userType');
            this.cookieService.delete('token');
            this.route.navigate(['/authentication/login']);
            reject('Session expired, redirecting to login');
          } else {
            this.toastr.error('Failed to retrieve data');
            reject('Failed to retrieve data');
          }
        },
        (error: any) => {
          console.log('Error:', error);
          this.toastr.error(error.statusText);
          reject(error);
        }
      );
    });
  }

  exportAsCSV(): void {
    const csvData = this.createCSV(this.currentStock);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'currentStock.csv';
    link.click();
  }

  createCSV(data: any[]): string {
    const header = ['SNo', 'Material Group', 'Material Name', 'UOM','Quantity'];

    const rows = data.map((item,index) => [
      index+1,
      item.group_name,
      item.material_name,
      item.material_unit,
      item.avaqty
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
      const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
      return materialName.includes(filter) || materialGroup.includes(filter) ||  materialUnit.includes(filter);;
    };

    this.dataSource.filter = filterValue;
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
   updateYearArray() {
    let currentYear = new Date().getFullYear();

    let firstYear = 2025;

    this.yearArray = [];
    for (let year = firstYear; year <= currentYear; year++) {
      this.yearArray.push(year);
    }

    this.selectedYear = currentYear;

  }




 getCurrentStock() {
  this.currentStockForm.patchValue({
    type: 'select',
    key: this.cookieService.get('token'),
  });

  let params = new HttpParams()
    .set('key', this.currentStockForm.get('key')?.value)
    .set('type', this.currentStockForm.get('type')?.value)

  this.CurrentStockData.getCurrentStock(params.toString()).subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.currentStock = response.data?.data1 || [];

       this.lowStock = [];
    this.mediumStock = [];
     this.highStock = [];

     this.currentStock.forEach(item => {
       const availableQty = parseFloat(item.avaqty);
       const alertQty = parseFloat(item.alert_qty);

       if (availableQty <= alertQty) {
           this.lowStock.push(item);
       } else if (availableQty > alertQty && availableQty <= 2 * alertQty) {
           this.mediumStock.push(item);
       } else {
           this.highStock.push(item);
       }
     });
this.currentStock = [...this.lowStock, ...this.mediumStock, ...this.highStock];


        this.currentStock = this.currentStock.map(item => {
          const alertQty = item.alert_qty;

          if (parseFloat(item.avaqty) <= parseFloat(alertQty)) {
            item.quantityStatus = 'red';
          } else if (parseFloat(item.avaqty) > alertQty && parseFloat(item.avaqty )<= parseFloat(alertQty) * 2) {
            item.quantityStatus = 'orange';
          } else {
            item.quantityStatus = 'green';
          }


          return item;
        });

        this.dataSource.data = this.currentStock;

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else if(response.message[0].status == 101){
        this.cookieService.delete('userId');
    this.cookieService.delete('userName');
    this.cookieService.delete('userType');
    this.cookieService.delete('token');
    this.route.navigate(['/authentication/login']);

      }else{
        this.toastr.error('Failed to retrieve data');
      }
    },
    (error: any) => {
      this.toastr.error(error.statusText);
    }
  );
}

graphfilter() {
  this.getGraph();
}

getGraph() {


  const formData = new FormData();

  formData.append('key', this.cookieService.get('token'));



  formData.append('item_id', this.selectProduct || '');
  formData.append('year', this.UserselectedYear || '204');

  this.CurrentStockData.getGraphData(formData).subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.graphData=response.data.data1;

        this.barChartData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Purchases',
              data: [],
              backgroundColor: 'rgba(40, 167, 69, 0.6)',
              borderColor: 'rgba(40, 167, 69, 1)',
              borderWidth: 1
            },
            {
              label: 'Sales',
              data: [],
              backgroundColor: 'rgba(0, 123, 255, 0.6)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1
            }

          ]
        };

        this.graphData.forEach(item => {
          this.barChartData.datasets[0].data.push(Number(item.purchases));
          this.barChartData.datasets[1].data.push(Number(item.sales));
        });



      } else if(response.message[0].status == 101){
        this.cookieService.delete('userId');
    this.cookieService.delete('userName');
    this.cookieService.delete('userType');
    this.cookieService.delete('token');
    this.route.navigate(['/authentication/login']);

      }else{
        this.toastr.error('Failed to retrieve data');
      }
    },
    (error: any) => {
      this.toastr.error(error.statusText);
    }
  );
}

}
