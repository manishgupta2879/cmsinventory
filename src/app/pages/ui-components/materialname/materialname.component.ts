import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';
import { UomService } from 'src/app/services/uom/uom.service';
import * as Papa from 'papaparse';
import { CsvdownloadService } from 'src/app/services/csvdownload.service';
import { Route, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MaterialgrpConfComponent } from 'src/app/materialgrp-conf/materialgrp-conf.component';





@Component({
  selector: 'app-materialname',
  standalone: false,
  templateUrl: './materialname.component.html',
  styleUrl: './materialname.component.scss'
})
export class MaterialnameComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    displayedColumns: string[] = ['sno', 'group_name','material_name','alert_qty','material_unit', 'actions'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selectedFile: File | null = null;
  parsedData: any[] = [];
  formType:any='form1';
  materialName!: FormGroup;
  filterForm!: FormGroup;
  materialGroups: any[] = [];
  filterMaterialGroups:any[]=[];
  materialTableData : any[]=[];
  errorData:any[]=[];
  totalPages:number=0;
  isUpdating :boolean = false;
  totalItems:number=0;
  currentPage:number=1;
  pageSize:number=10;
  paginatedData: any[] = [];
  key:any;
uomList:any[]=[];
  constructor(
    private materialgroup: MaterialgroupService,
    private uomService:UomService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private materialnameService: MaterialnameService,
    private csvDownloadService:CsvdownloadService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    const token = this.cookieService.get('token');
    this.key = token;
    this.materialName = new FormGroup({
      key: new FormControl(token),

      materialgroup: new FormControl('', [Validators.required]),
      materialname: new FormControl('', [Validators.required]),
      alert_qty: new FormControl(''),
      uom: new FormControl('', [Validators.required]),
      des:new FormControl(''),
      type:new FormControl('select'),
      id:new FormControl('')

    });


    this.filterForm = new FormGroup({
      materialGroup:  new FormControl(''),
      materialName:  new FormControl(''),
      transactionDate:  new FormControl('')
    });

    this.showMaterial();
    this.showMaterialName();
    this.showMaterialUom();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const materialName = data.material_name ? data.material_name.toLowerCase() : '';
      const materialGroup = data.group_name ? data.group_name.toLowerCase() : '';
      const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
      const alertQty = data.alert_qty ? data.alert_qty.toLowerCase() : '';
      return materialName.includes(filter) || materialGroup.includes(filter) ||  materialUnit.includes(filter) || alertQty.includes(filter);
    };

    this.dataSource.filter = filterValue;
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


    exportAsCSV(): void {
      const csvData = this.createCSV(this.materialTableData);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'materials.csv';
      link.click();
    }

    createCSV(data: any[]): string {
      const header = ['SNo', 'Material Group', 'Material Name','Alert Quantity', 'UOM'];

      const rows = data.map((item,index) => [
        index+1,
        item.group_name,
        item.material_name,
        item.alert_qty,
        item.material_unit,

      ]);

      const csvContent = [
        header.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csvContent;
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


  showMaterial() {


    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_name', this.materialName.get('group_name')?.value)
      .set('group_id', this.materialName.get('group_id')?.value)

    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.materialGroups = response.data?.data1 || [];
          this.filterMaterialGroups = response.data?.data1 || [];

        }
        else if(response.message[0].status == 101){
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

  download(): void {
    const data = [
      { 'Material Group': 'Disposables','Material Name':"cup",uom:'NOS.',Description:'sampl1'},
      { 'Material Group': 'Disposables','Material Name':"plate",uom:'NOS.',Description:'sample2'},
      { 'Material Group': 'cold drinks','Material Name':"coca cola",uom:'LTR',Description:'discription'},
    ];

    this.csvDownloadService.downloadCSV(data, 'MaterialName_sample.csv');
  }



  showMaterialUom() {


    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)

    this.uomService.getUomList(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.uomList = response.data?.data1 || [];
        }  else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else{
          this.toastr.error('Failed to retrieve data');
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }


  showMaterialName() {
    this.materialName.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });

    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)

    this.materialnameService.getMaterialName(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.materialTableData = response.data?.data1 || [];
          this.dataSource.data = this.materialTableData;


          this.totalItems= response.data?.data1.length;
          this.totalPages=Math.ceil(this.totalItems / this.pageSize)
          this.paginateData()
        }  else if(response.message[0].status == 101){
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


  paginateData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.materialTableData.slice(startIndex, endIndex);

  }


  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }



  createMaterialName() {
    if (this.materialName.invalid) {
      this.materialName.markAllAsTouched();
      return;
    }
    this.materialName.patchValue({
      type: 'insert'
    });

    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('material_unit', this.materialName.get('uom')?.value)
      .set('group_id', this.materialName.get('materialgroup')?.value)
      .set('material_name', this.materialName.get('materialname')?.value)
      .set('material_description', this.materialName.get('des')?.value)
      .set('alert_qty', this.materialName.get('alert_qty')?.value);


    this.materialnameService.createMaterialName(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const message = response.data?.msg || 'Material Group Created';
          this.toastr.success(message);
          this.resetForm();

          this.showMaterialName();
          const data = response.data;
          console.log('Key:', data);
        }  else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to Create');
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }

  onUpdate() {
    if (this.materialName.valid) {
      let params = new HttpParams()


        .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_id', this.materialName.get('materialgroup')?.value)
      .set('material_name', this.materialName.get('materialname')?.value)
      .set('munitid',this.materialName.get('uom')?.value)
      .set('material_description', this.materialName.get('des')?.value)
      .set('material_id', this.materialName.get('id')?.value)
      .set('alert_qty', this.materialName.get('alert_qty')?.value)


      this.materialnameService.updateMaterialName(params.toString()).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            const message = response.data?.msg || 'Material Group Updated';
            this.toastr.success(message);
            this.resetForm();
            const key = response.data?.key;
            this.showMaterialName();
            console.log('Key:', key);
          }  else if(response.message[0].status == 101){
            this.cookieService.delete('userId');
        this.cookieService.delete('userName');
        this.cookieService.delete('userType');
        this.cookieService.delete('token');
        this.router.navigate(['/authentication/login']);

          }else {
            this.toastr.error('Failed to Update');
          }
        },
        (error: any) => {
          console.log('Error:', error);
          this.toastr.error(error.statusText);
        }
      );
    } else {
      this.toastr.error('Please fill out the form correctly');
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.paginateData();
  }


  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  onDelete(item: any): void {
    const dialogRef = this.dialog.open(MaterialgrpConfComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMaterialName(item)
      } else {
        console.log('Delete canceled');
      }
    });
  }


    deleteMaterialName(item: any) {
    this.materialName.patchValue({
      type: 'delete'
    });


      let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_id', '')
      .set('munitid', '')
      .set('material_name', item.material_name)
      .set('material_description','')
      .set('material_id', item.id)



    this.materialnameService.DetleteMaterialName(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success(response.data?.msg || 'Material Deleted');
          this.showMaterialName();
        }else if(response.status === 'error'){
          this.toastr.error(response.data?.msg);
        }else if(response?.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to delete material');
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }


  uploadSubmit(): void {
    if (!this.selectedFile) {
      this.toastr.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('key',this.key);
    formData.append('file', this.selectedFile as File);


    this.materialnameService.materialNamecsv(formData).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          if(response?.data?.data1?.errors?.length >0){
            this.errorData=response?.data?.data1?.errors;
          }else{
            this.errorData=[]
          }
          this.toastr.success('Material uploaded successfully');
          this.resetForm();
          this.showMaterialName();



        }  else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else {
          this.toastr.error('Failed to upload file');
        }
      },
      (error: any) => {
        console.error('Error:', error);
        this.toastr.error(error.statusText || 'Error uploading file');
      }
    );
  }

  updateMaterialName(item: any) {
    this.formType='form1'
    this.materialName.patchValue({
      materialgroup: item.group_id,
      materialname: item.material_name,
      uom:item.munitid,
      des:item.material_description,
      alert_qty:item.alert_qty,
      type: 'update' ,
      id:item.id,

    });

    this.isUpdating = true;
  }

  resetForm() {
    this.isUpdating = false;
    this.materialName.reset({
      key: this.cookieService.get('token'),
      type: '',
      materialgroup: '',
      materialname: '',
      uom:'',
      des:''
    })
  }

}
