import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { InwardconfComponent } from 'src/app/inwardconf/inwardconf.component';
import { validateHorizontalPosition } from '@angular/cdk/overlay';


@Component({
  selector: 'app-inwardstock',
  standalone: false,
  templateUrl: './inwardstock.component.html',
  styleUrl: './inwardstock.component.scss'
})
export class InwardstockComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    displayedColumns: string[] = ['sno', 'group_name','material_name','material_unit', 'invoice_no','qty','invoice_date','transition_date', 'actions'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();

  materialName!: FormGroup;
  inwardForm!: FormGroup;
  materialGroups: any[] = [];
  filterMaterialGroups :any[]=[];
  material:any[]=[];
  selectedMaterialGroupId:any='';
  selectedMaterialNameId:any='';
  inwardListData:any[]=[];
  totalPages:number=0;
  currentPage:number=1;
  totalItems:number=0;
  pageSize:number=10;
  filterForm!: FormGroup;
  paginatedData:any[]=[];
  isUpdating:boolean=false;
  stockId:any='';
  filterType:any='';
  itemId:any='';
  transDate:any='';
  filterMaterialName:any='';
  searchTerm: string = '';
  totalPage: number = 0;




  constructor(
    private materialgroup: MaterialgroupService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private materialnameService: MaterialnameService,
    private router: Router,
    private dialog: MatDialog


  ) { }



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
          this.materialGroups = response.data?.data1 || [] ;
          this.filterMaterialGroups = response.data?.data1 ;

        }
        else if(response.message[0].status == 101){
                this.cookieService.delete('userId');
            this.cookieService.delete('userName');
            this.cookieService.delete('userType');
            this.cookieService.delete('token');
            this.router.navigate(['/authentication/login']);

              }else{
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

    onDelete(item: any): void {
      const dialogRef = this.dialog.open(InwardconfComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteInward(item)
        } else {
          console.log('Delete canceled');
        }
      });
    }


    exportAsCSV(): void {
      const csvData = this.createCSV(this.inwardListData);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'inwardStock.csv';
      link.click();
    }

    createCSV(data: any[]): string {
      const header = ['SNo', 'Material Group', 'Material Name', 'UOM','Invoice No.','Quantity','Invoice Date','Transaction Date'];

      const rows = data.map((item,index) => [
        index+1,
        item.group_name,
        item.material_name,
        item.material_unit,
        item.invoice_no,
        item.qty,
        item.invoice_date,
        item.transition_date
      ]);

      const csvContent = [
        header.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csvContent;
    }




  getMaterial(event: Event) {

    const selectElement = event.target as HTMLSelectElement;
  const selectedGroupId = selectElement.value;

this.selectedMaterialGroupId = selectedGroupId;

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

        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else{
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

  getMaterialFilter(event: Event) {

    const selectElement = event.target as HTMLSelectElement;
  const selectedGroupId = selectElement.value;

this.selectedMaterialGroupId = selectedGroupId;

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
          this.filterMaterialName = response.data?.data1 || [];

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



  getMaterialName(event:Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedMaterialId = selectElement.value;

  this.selectedMaterialNameId = selectedMaterialId;
  }



  deleteInward(item:any){
    if(item.initial_state =='1'){
      this.toastr.error('Initial Stock cannot be deleted');
      window.scrollTo(0, 0);
      return;
    }

      const reorderedPayload = {
        type:"delete",
        stockid:item.id,
        key: this.cookieService.get('token'),


      };

      const httpParams = new HttpParams({ fromObject: reorderedPayload });


      this.materialnameService.createInward(httpParams.toString()).subscribe(
        (response: any) => {
          if (response.status === 'success') {

            this.toastr.success('Inward deleted successfully');
            window.scrollTo(0, 0);
            this.inwardList();

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



  updateInward(item: any) {
    if(item.initial_state =='1'){
      this.toastr.error('Initial Stock cannot be updated');
      window.scrollTo(0, 0);
      return;
    }
    this.getMaterialNameBasedOnGroup(item.group_id,item);
    this.stockId = item.id;


  }


  getMaterialNameBasedOnGroup(groupId: string,item:any) {
    this.selectedMaterialGroupId = groupId;

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
            this.inwardForm.patchValue({
                materialgroup: item.group_id,
                invoice: item.invoice_no,
                quantity: item.qty,
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

  onUpdate() {
    if (this.inwardForm.invalid) {
      this.inwardForm.markAllAsTouched();
      return;
    }




    const reorderedPayload = {
      invoice_no: this.inwardForm.value.invoice?this.inwardForm.value.invoice:'',
      invoice_date: this.inwardForm.value.invoicedate?this.inwardForm.value.invoicedate:'',
      group_id: this.inwardForm.value.materialgroup,
      item_id: this.inwardForm.value.materialname,
      qty: this.inwardForm.value.quantity,
      trans_date: this.inwardForm.value.transdate,
      type:"inwardupdate",
      key: this.cookieService.get('token'),
      stockid:this.stockId,
      nooforders:''


    };

    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {

          this.toastr.success('Inward updated successfully');
          this.inwardList();
          this.resetForm();
          window.scrollTo(0, 0);

        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);
      window.scrollTo(0, 0);

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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const materialName = data.material_name ? data.material_name.toLowerCase() : '';
      const materialGroup = data.group_name ? data.group_name.toLowerCase() : '';
      const Invoiceno = data.invoice_no ? data.invoice_no.toLowerCase() : '';
      const QTY = data.qty ? data.qty.toLowerCase() : '';
      const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
      return materialName.includes(filter) || materialGroup.includes(filter) ||  Invoiceno.includes(filter) || QTY.includes(filter)|| materialUnit.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }




  inwardSubmit() {
    if (this.inwardForm.invalid) {
      this.inwardForm.markAllAsTouched();
      return;
    }

    const reorderedPayload = {
      invoice_no: this.inwardForm.value.invoice,
      invoice_date: this.inwardForm.value.invoicedate,
      group_id: this.inwardForm.value.materialgroup,
      item_id: this.inwardForm.value.materialname,
      qty: this.inwardForm.value.quantity,
      trans_date: this.inwardForm.value.transdate,
      type:"inward",
      key: this.cookieService.get('token'),
      nooforders:''

    };
    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success('Invard added successfully');
          this.resetForm();
          this.inwardList();
          window.scrollTo(0, 0);

        } else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);
      window.scrollTo(0, 0);

        }else {
          this.toastr.error('Failed to retrieve data');
          window.scrollTo(0, 0);
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }


  inwardList() {


    const reorderedPayload = {

      type:this.filterType? this.filterType :"selectinward",
      key: this.cookieService.get('token'),
      item_id:this.itemId ? this.itemId :'',
      trans_date:this.transDate ? this.transDate :''
    };
    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {

  this.inwardListData=response.data.data1 || [];
  this.totalItems = this.inwardListData.length;
  this.totalPages = Math.ceil(this.totalItems/this.pageSize);
  this.pagination()
  this.dataSource.data = this.inwardListData;


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


  pagination(){
    console.log("paginted updating")
    const startIndex = (this.currentPage -1)* this.pageSize;
    const endIndex = startIndex+this.pageSize;
    this.paginatedData = this.inwardListData.slice(startIndex,endIndex);
    this.dataSource.data = this.paginatedData;
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

  ngOnInit(): void {
    this.inwardList()
    const token = this.cookieService.get('token');
    this.inwardForm = new FormGroup({
      materialgroup: new FormControl('',[Validators.required]),
      materialname: new FormControl('',[Validators.required]),
      invoice: new FormControl('',[Validators.required]),
      quantity: new FormControl('',[Validators.required]),
      invoicedate: new FormControl('',[Validators.required]),
      transdate: new FormControl('',[Validators.required]),

    })

    this.materialName = new FormGroup({
      key: new FormControl(token),
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      uom: new FormControl(''),
      des:new FormControl(''),
      type:new FormControl('select'),
      id:new FormControl('')

    });

    this.filterForm = new FormGroup({
      filtermaterialGroup:  new FormControl(''),
      item_id:  new FormControl(''),
      trans_date:  new FormControl('')
    });

    this.showMaterial();
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
  console.log("filter is ", abc)
  this.currentPage=1;
  this.inwardList();
  }


  resetForm() {
    this.inwardForm.reset({
      materialgroup: '',
      materialname:'',
      invoice: '',
      quantity: '',
      invoicedate: '',
      transdate: '',
    })
    this.isUpdating=false;
  }

}
