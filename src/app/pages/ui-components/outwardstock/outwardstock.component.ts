import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { OutwardconfComponent } from 'src/app/outwardconf/outwardconf.component';


@Component({
  selector: 'app-outwardstock',
  standalone: false,
  templateUrl: './outwardstock.component.html',
  styleUrl: './outwardstock.component.scss'
})
export class OutwardstockComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

      displayedColumns: string[] = ['sno', 'group_name','material_name','qty','material_unit','transition_date','outward_orders','outward_date','actions'];
      dataSource: MatTableDataSource<any> = new MatTableDataSource();
  materialGroups: any[] = [];
  material:any[]=[];
  filterMaterialGroups:any[]=[];
  materialName!: FormGroup;
  outwardForm!: FormGroup;
  filterForm!: FormGroup;
  outwardListData:any[]=[];
  isUpdating:boolean=false;
  stockId:any='';
  totalPages:number=0;
  filterType:any='';
  itemId:any='';
  transDate:any=''
  currentPage:number=1;
  totalItems:number=0;
    totalPage: number = 0;
  pageSize:number=10;
  paginatedData:any[]=[];
  filterName:any[]=[]

  constructor(
    private materialgroup: MaterialgroupService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private materialnameService: MaterialnameService,
    private router: Router,
    private dialog: MatDialog



  ) { }


  getMaterial(event: Event) {

    const selectElement = event.target as HTMLSelectElement;
  const selectedGroupId = selectElement.value;



    this.materialName.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });


    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)

      .set('group_id', selectedGroupId);
    this.materialnameService.getMaterialNameByGroup(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.material = response.data?.data1 || [];
        }  else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);

      }
    );
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getMaterialFilter(event: Event) {

    const selectElement = event.target as HTMLSelectElement;
  const selectedGroupId = selectElement.value;



    this.materialName.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });


    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_id', selectedGroupId);
    this.materialnameService.getMaterialNameByGroup(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.filterName = response.data?.data1 || [];
        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);

        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);

      }
    );
  }


  outwardSubmit() {
    if (this.outwardForm.invalid) {
      this.outwardForm.markAllAsTouched();
      return;
    }


    const reorderedPayload = {
      invoice_no: this.outwardForm.value.invoice,
      invoice_date: '',
      nooforders: this.outwardForm.value.nooforders,
      group_id: this.outwardForm.value.materialgroup,
      item_id: this.outwardForm.value.materialname,
      qty: this.outwardForm.value.quantity,
      trans_date: this.outwardForm.value.transdate,
      type:"outward",
      key: this.cookieService.get('token'),

    };
    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {


        if (response.status === 'success') {
          this.toastr.success('Outward added successfully');
          this.resetForm();
          this.outwardList();
          window.scrollTo(0, 0);
        }else if(response?.message){
          this.toastr.error(response.message.msg);
          this.resetForm();
          window.scrollTo(0, 0);
        }else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);

        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);
      }
    );
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




  outwardList() {

    const reorderedPayload = {
      type:this.filterType? this.filterType :"selectoutward",

      key: this.cookieService.get('token'),
        item_id:this.itemId ? this.itemId :'',
      trans_date:this.transDate ? this.transDate :''


    };

    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
this.outwardListData= response.data.data1;
this.totalItems = response.data.data1.length;
this.totalPages = Math.ceil(this.totalItems/this.pageSize);
this.pagination()
this.dataSource.data = this.outwardListData;
        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);

      }
    );
  }

    onDelete(item: any): void {
        const dialogRef = this.dialog.open(OutwardconfComponent);

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.deleteOutward(item)
          } else {
            console.log('Delete canceled');
          }
        });
      }


  onUpdate() {
    if (this.outwardForm.invalid) {
      this.outwardForm.markAllAsTouched();
      return;
    }



    const reorderedPayload = {
      invoice_no:'',
      invoice_date:'',
      group_id: this.outwardForm.value.materialgroup,
      item_id: this.outwardForm.value.materialname,
       qty: Math.abs(this.outwardForm.value.quantity),
      trans_date: this.outwardForm.value.transdate,
      type:"outwardupdate",
      key: this.cookieService.get('token'),
      stockid:this.stockId,
      nooforders:this.outwardForm.value.nooforders


    };

    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {

          this.toastr.success('outward updated successfully');
          this.outwardList();
          this.resetForm();
          window.scrollTo(0, 0);

        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);

      }
    );
  }




  deleteOutward(item:any){

    const reorderedPayload = {

      type:"delete",
      stockid:item.id,
      key: this.cookieService.get('token'),


    };

    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {

          this.toastr.success('Outward deleted successfully');
          this.outwardList();
          window.scrollTo(0, 0);

        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);

        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);

      }
    );



}

exportAsCSV(): void {
  const csvData = this.createCSV(this.outwardListData);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'outwardStock.csv';
  link.click();
}

createCSV(data: any[]): string {
  const header = ['SNo', 'Material Group', 'Material Name','Quantity', 'UOM','Transaction Date',' No. of Order procceed','Outward Date',];

  const rows = data.map((item,index) => [
    index+1,
    item.group_name,
    item.material_name,
    item.qty,
    item.material_unit,
    item.transition_date,
    item.outward_orders,
    item.outward_date
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}



  updateOutward(item: any) {
    this.getMaterialNameBasedOnGroup(item.group_id,item);
    this.stockId = item.id;


  }

  getMaterialNameBasedOnGroup(groupId: string,item:any) {

    this.materialName.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });

    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_id', groupId);

    this.materialnameService.getMaterialNameByGroup(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.material = response.data?.data1 || [];


          setTimeout(() => {
            this.outwardForm.patchValue({
                materialgroup: item.group_id,
                invoice: item.invoice_no,
                quantity: Math.abs(item.qty),
                invoicedate: item.invoice_date,
                transdate: item.transition_date,
                materialname: item.item_id,
                nooforders: item.outward_orders
            });
        }, 0);


          this.isUpdating = true;

        }else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        } else {
          this.toastr.error('Failed to retrieve materials');
          window.scrollTo(0, 0);

        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);

      }
    );
  }

  ngOnInit(): void {
    this.outwardList();
    const token = this.cookieService.get('token');

    this.outwardForm = new FormGroup({
      materialgroup: new FormControl('',[Validators.required]),
      materialname: new FormControl('',[Validators.required]),
      transdate: new FormControl('',[Validators.required]),
      quantity: new FormControl('',[Validators.required]),
      orderprocess: new FormControl(''),
      nooforders: new FormControl('',[Validators.required]),

    })

    this.materialName = new FormGroup({
      key: new FormControl(token),
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      uom: new FormControl(''),
      des:new FormControl(''),
      type:new FormControl('select'),
      id:new FormControl('')

    })

    this.filterForm = new FormGroup({
      filtermaterialGroup:  new FormControl(''),
      item_id:  new FormControl(''),
      trans_date:  new FormControl('')
    });



    this.showMaterial();
  }





  showMaterial() {


    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_name', this.materialName.get('group_name')?.value)
      .set('group_id', this.materialName.get('materialgroup')?.value)


    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.materialGroups = response.data?.data1 || [];
          this.filterMaterialGroups = response.data?.data1 || [];


        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
        window.scrollTo(0, 0);
      }
    );
  }


  applyfilter(type:any){

    const itemId = this.filterForm?.get('item_id')?.value;
    const filterMaterialGroup = this.filterForm?.get('filtermaterialGroup')?.value;

    if ((itemId && !filterMaterialGroup) || (!itemId && filterMaterialGroup)) {
      this.toastr.error('Please select both Material Item and Material  Group.');
      return;
    }

    this.filterType=type
  const abc=  this.filterForm.value
  this.itemId = this.filterForm.get('item_id')?.value;
  this.transDate = this.filterForm.get('trans_date')?.value;
  this.currentPage=1;
  this.outwardList();
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const materialName = data.material_name ? data.material_name.toLowerCase() : '';
      const materialGroup = data.group_name ? data.group_name.toLowerCase() : '';
      const QTY = data.qty ? data.qty.toLowerCase() : '';
      const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
      const nooforders = data.outward_orders ? data.outward_orders.toLowerCase() : '';
      return materialName.includes(filter) || materialGroup.includes(filter)  || QTY.includes(filter)|| materialUnit.includes(filter) || nooforders.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }

  pagination(){
    const startIndex = (this.currentPage -1)* this.pageSize;
    const endIndex = startIndex+this.pageSize;
    this.paginatedData = this.materialGroups.slice(startIndex,endIndex)
  }


  previousPage(){
    if(this.currentPage >1){
       this.currentPage--;
       this.pagination();
    }
  }

  nextPage(){
    if(this.currentPage < this.totalPages){
      this.currentPage++;
      this.pagination();
    }
  }

  resetForm() {
    this.outwardForm.reset({
      materialgroup: '',
      materialname:'',
      invoice: '',
      quantity: '',
      invoicedate: '',
      transdate: '',
    })
    this.isUpdating = false;
  }


}
