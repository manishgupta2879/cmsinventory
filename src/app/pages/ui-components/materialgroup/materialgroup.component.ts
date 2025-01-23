
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';

@Component({
  selector: 'app-materialgroup',
  templateUrl: './materialgroup.component.html',
  styleUrls: ['./materialgroup.component.scss']
})
export class MaterialgroupComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['sno', 'group_name', 'created_at', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  materialGroup!: FormGroup;
  materialGroups: any[] = [];
  paginatedData: any[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  searchTerm: string = '';
  totalPage: number = 0;
  currentPage = 1;
  isUpdating: boolean = false;

  constructor(
    private cookieService: CookieService,
    private toastr: ToastrService,
    private materialgroup: MaterialgroupService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.get('token');

    this.materialGroup = new FormGroup({
      key: new FormControl(token),
      type: new FormControl(''),
      group_name: new FormControl('', [Validators.required]),
      group_id: new FormControl(''),
    });

    this.showMaterial();
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
      return materialName.includes(filter) || materialGroup.includes(filter) ||  materialUnit.includes(filter);;
    };

    this.dataSource.filter = filterValue;
  }


  showMaterial() {
    this.materialGroup.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });



    let params = new HttpParams()
      .set('key', this.materialGroup.get('key')?.value)
      .set('type', this.materialGroup.get('type')?.value)
      .set('group_name', this.materialGroup.get('group_name')?.value)
      .set('group_id', this.materialGroup.get('group_id')?.value);

    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.materialGroups = response.data?.data1 || [];
          if(response.data?.data1 == null){
            this.materialGroups =[]
          }
          this.totalItems = response.data?.data1?.length;
          this.totalPage = Math.ceil(this.totalItems / this.pageSize);
          this.pagination();
          this.dataSource.data = this.materialGroups;
          this.cdr.detectChanges();
        } else if (response.message[0].status === 101) {
          this.cookieService.delete('userId');
          this.cookieService.delete('userName');
          this.cookieService.delete('userType');
          this.cookieService.delete('token');
          this.router.navigate(['/authentication/login']);
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

  paginateData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.data.slice(startIndex, endIndex);
    this.totalPage = Math.ceil(this.dataSource.data.length / this.pageSize);
  }

  pagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.materialGroups.slice(startIndex, endIndex);
    this.dataSource.data = this.paginatedData;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.pagination();
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.paginateData();
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

  resetForm() {
    this.isUpdating = false;
    this.materialGroup.reset({
      key: this.cookieService.get('token'),
      type: '',
      group_name: '',
      group_id: '',
    });
  }

  materialSave() {
    if (this.materialGroup.invalid) {
      this.materialGroup.markAllAsTouched();
      return;
    }
    this.materialGroup.patchValue({
      type: 'insert'
    });

    let params = new HttpParams()
      .set('key', this.materialGroup.get('key')?.value)
      .set('type', this.materialGroup.get('type')?.value)
      .set('group_name', this.materialGroup.get('group_name')?.value)
      .set('group_id', this.materialGroup.get('group_id')?.value);

    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success(response.data?.msg || 'Material Group Created');
          this.resetForm();
          this.showMaterial();
        }else if(response.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        } else {
          this.toastr.error('Failed to Create');
        }
      },
      (error: any) => {
        this.toastr.error(error.statusText);
      }
    );
  }

  onDelete(item: any): void {
    const dialogRef = this.dialog.open(ConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMaterial(item)
      } else {
        console.log('Delete canceled');
      }
    });
  }


  deleteMaterial(groupId: string) {
    this.materialGroup.patchValue({
      type: 'delete'
    });

    let params = new HttpParams()
      .set('key', this.materialGroup.get('key')?.value)
      .set('type', this.materialGroup.get('type')?.value)
      .set('group_name', this.materialGroup.get('group_name')?.value)
      .set('group_id', groupId);

    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.showMaterial();
          this.toastr.success(response.data?.msg || 'Material Group Deleted');
        }else if(response.status === 'error'){
          this.toastr.error(response.data?.msg);
        }else if(response?.message[0].status == 101){
          this.cookieService.delete('userId');
      this.cookieService.delete('userName');
      this.cookieService.delete('userType');
      this.cookieService.delete('token');
      this.router.navigate(['/authentication/login']);

        }else{
          this.toastr.error('Failed to delete material group');
        }
      },
      (error: any) => {
        this.toastr.error(error.statusText);
      }
    );
  }

  updateMaterial(item: any) {
    this.materialGroup.patchValue({
      group_name: item.group_name,
      group_id: item.id,
      type: 'update'
    });
    this.isUpdating = true;
  }

  onUpdate() {
    if (this.materialGroup.valid) {
      let params = new HttpParams()
        .set('key', this.materialGroup.get('key')?.value)
        .set('type', this.materialGroup.get('type')?.value)
        .set('group_name', this.materialGroup.get('group_name')?.value)
        .set('group_id', this.materialGroup.get('group_id')?.value);

      this.materialgroup.userLogin(params.toString()).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.toastr.success(response.data?.msg || 'Material Group Updated');
            this.resetForm();
            this.showMaterial();
          }else if(response.message[0].status == 101){
            this.cookieService.delete('userId');
        this.cookieService.delete('userName');
        this.cookieService.delete('userType');
        this.cookieService.delete('token');
        this.router.navigate(['/authentication/login']);

          } else {
            this.toastr.error('Failed to Update');
          }
        },
        (error: any) => {
          this.toastr.error(error.statusText);
        }
      );
    }
  }
}



