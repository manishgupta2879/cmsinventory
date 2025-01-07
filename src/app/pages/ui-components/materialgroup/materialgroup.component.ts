// import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
// import { CookieService } from 'ngx-cookie-service';
// import { ToastrService } from 'ngx-toastr';
// import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
// import { HttpHeaders, HttpParams } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';

// @Component({
//   selector: 'app-materialgroup',
//   standalone: false,
//   templateUrl: './materialgroup.component.html',
//   styleUrl: './materialgroup.component.scss'
// })
// export class MaterialgroupComponent implements OnInit {
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   displayedColumns: string[] = ['sno', 'group_name', 'created_at', 'actions'];
//   dataSource: MatTableDataSource<any> = new MatTableDataSource();
//   materialGroup!: FormGroup;
//   filterForm!: FormGroup;
//   materialGroups: any[] = [];
//   totalItems:number=0;
//   pageSize:number=10;
//   totalPage:number=0
//   paginatedData:any[]=[];
//   currentPage=1;


//   isUpdating: boolean = false;

//   constructor(
//     private cookieService: CookieService,
//     private toastr: ToastrService,
//     private materialgroup: MaterialgroupService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     const token = this.cookieService.get('token');

//     this.materialGroup = new FormGroup({
//       key: new FormControl(token),
//       type: new FormControl(''),
//       group_name: new FormControl(''),
//       group_id: new FormControl(''),
//     });

//     this.filterForm = new FormGroup({
//       materialGroup:  new FormControl(''),
//       materialName:  new FormControl(''),
//       transactionDate:  new FormControl('')
//     });

//     this.showMaterial();
//   }


//   materialSave() {
//     // Set the type value as 'insert' before submitting the form
//     this.materialGroup.patchValue({
//       type: 'insert'
//     });

//     // Create HttpParams for URL-encoded format
//     let params = new HttpParams()
//       .set('key', this.materialGroup.get('key')?.value)
//       .set('type', this.materialGroup.get('type')?.value)
//       .set('group_name', this.materialGroup.get('group_name')?.value)
//       .set('group_id', this.materialGroup.get('group_id')?.value);

//     // Make HTTP call and rely on the service to handle headers
//     this.materialgroup.userLogin(params.toString()).subscribe(
//       (response: any) => {
//         if (response.status === 'success') {
//           const message = response.data?.msg || 'Material Group Created';
//           this.toastr.success(message);
//           this.resetForm();
//           this.showMaterial();
//           const key = response.data?.key;
//           console.log('Key:', key);
//         } else if(response.message[0].status == 101){
//           this.cookieService.delete('userId');
//       this.cookieService.delete('userName');
//       this.cookieService.delete('userType');
//       this.cookieService.delete('token');
//       this.router.navigate(['/authentication/login']);

//         }else {
//           this.toastr.error('Failed to Create');
//         }
//       },
//       (error: any) => {
//         console.log('Error:', error);
//         this.toastr.error(error.statusText);
//       }
//     );
//   }


//   onPageChange(event:any) {
//     this.currentPage = event.pageIndex + 1;
//     this.pageSize = event.pageSize;
//     this.paginateData();
//   }

//   paginateData() {
//     // Replace this with actual pagination logic
//     const startIndex = (this.currentPage - 1) * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     this.paginatedData = this.dataSource.data.slice(startIndex, endIndex);
//     this.totalPage = Math.ceil(this.dataSource.data.length / this.pageSize);
//   }

//   updateMaterial(item: any) {
//     // Patch the form fields with the values from the selected row
//     this.materialGroup.patchValue({
//       group_name: item.group_name, // Patch group_name from the item
//       group_id: item.id, // Use item.id for group_id
//       type: 'update' // Set type as 'update'
//     });

//     // Set isUpdating to true to hide the submit button
//     this.isUpdating = true;
//   }



//   onUpdate() {
//     // Ensure form is valid before submitting
//     if (this.materialGroup.valid) {
//       // Create HttpParams for URL-encoded format
//       let params = new HttpParams()
//         .set('key', this.materialGroup.get('key')?.value)
//         .set('type', this.materialGroup.get('type')?.value)
//         .set('group_name', this.materialGroup.get('group_name')?.value)
//         .set('group_id', this.materialGroup.get('group_id')?.value);

//       // Make HTTP call and rely on the service to handle headers
//       this.materialgroup.userLogin(params.toString()).subscribe(
//         (response: any) => {
//           if (response.status === 'success') {
//             const message = response.data?.msg || 'Material Group Updated';
//             this.toastr.success(message);
//             this.resetForm(); // Reset form after successful update
//             const key = response.data?.key;
//             this.showMaterial();
//             console.log('Key:', key);
//           }
//           else if(response.message[0].status == 101){
//                   this.cookieService.delete('userId');
//               this.cookieService.delete('userName');
//               this.cookieService.delete('userType');
//               this.cookieService.delete('token');
//               this.router.navigate(['/authentication/login']);

//                 }else {
//             this.toastr.error('Failed to Update');
//           }
//         },
//         (error: any) => {
//           console.log('Error:', error);
//           this.toastr.error(error.statusText);
//         }
//       );
//     } else {
//       this.toastr.error('Please fill out the form correctly');
//     }
//   }

//   showMaterial() {
//     // Set the type value as 'select' before submitting the form
//     this.materialGroup.patchValue({
//       type: 'select',
//       key: this.cookieService.get('token'),
//     });

//     // Create HttpParams for URL-encoded format
//     let params = new HttpParams()
//       .set('key', this.materialGroup.get('key')?.value)
//       .set('type', this.materialGroup.get('type')?.value)
//       .set('group_name', this.materialGroup.get('group_name')?.value)
//       .set('group_id', this.materialGroup.get('group_id')?.value);

//     // Make HTTP call and rely on the service to handle headers
//     this.materialgroup.userLogin(params.toString()).subscribe(
//       (response: any) => {
//         if (response.status === 'success') {
//           // this.toastr.success(response.data?.msg || 'Material Group Created');
//           this.materialGroups = response.data?.data1 || []; // Assign the material groups to the local array
//          this.totalItems= response.data?.data1.length;
//          this.totalPage = Math.ceil(this.totalItems/this.pageSize);
//          this.pagination();


//         }
//         else if(response.message[0].status == 101){
//                 this.cookieService.delete('userId');
//             this.cookieService.delete('userName');
//             this.cookieService.delete('userType');
//             this.cookieService.delete('token');
//             this.router.navigate(['/authentication/login']);

//               }else {
//           this.toastr.error('Failed to retrieve data');
//         }
//       },
//       (error: any) => {
//         console.log('Error:', error);
//         this.toastr.error(error.statusText);
//       }
//     );
//   }

//   pagination(){
//     const startIndex = (this.currentPage -1) * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     this.paginatedData= this.materialGroups.slice(startIndex,endIndex);
//   }




//   previousPage(){
//     if(this.currentPage >1){
//       this.currentPage--;
//       this.pagination()
//     }
//   }

//   nextPage(){
//     if(this.currentPage <this.totalPage){
//       this.currentPage++;
//       this.pagination()
//     }
//   }
//   deleteMaterial(groupId: string) {
//     // Set the type value as 'delete' before submitting the form
//     this.materialGroup.patchValue({
//       type: 'delete'
//     });

//     // Create HttpParams for URL-encoded format, including groupId
//     let params = new HttpParams()
//       .set('key', this.materialGroup.get('key')?.value)
//       .set('type', this.materialGroup.get('type')?.value)
//       .set('group_name', this.materialGroup.get('group_name')?.value)
//       .set('group_id', groupId); // Use groupId passed to this function

//     // Make HTTP call and rely on the service to handle headers
//     this.materialgroup.userLogin(params.toString()).subscribe(
//       (response: any) => {
//         if (response.status === 'success') {
//           this.toastr.success(response.data?.msg || 'Material Group Deleted');
//           this.materialGroups = response.data?.data1 || []; // Refresh the list after deletion
//           this.showMaterial();
//         }
//         else if(response.message[0].status == 101){
//                 this.cookieService.delete('userId');
//             this.cookieService.delete('userName');
//             this.cookieService.delete('userType');
//             this.cookieService.delete('token');
//             this.router.navigate(['/authentication/login']);

//               }
//               else {
//           this.toastr.error('Failed to delete material group');
//         }
//       },
//       (error: any) => {
//         console.log('Error:', error);
//         this.toastr.error(error.statusText);
//       }
//     );
//   }

//   compare(a: string | number, b: string | number, isAsc: boolean) {
//     return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
//   }


//   onSortData(sort:any) {
//     this.paginatedData = this.paginatedData.sort((a, b) => {
//       const isAsc = sort.direction === 'asc';
//       switch (sort.active) {
//         case 'group_name': return this.compare(a.group_name, b.group_name, isAsc);
//         case 'created_at': return this.compare(a.created_at, b.created_at, isAsc);
//         default: return 0;
//       }
//     });
//     this.dataSource.data = this.paginatedData;
//   }




//   resetForm() {
//     this.isUpdating = false;
//     this.materialGroup.reset({
//       key: '',
//       type: '',
//       group_name: '',
//       group_id: '',
//     })
//   }





// }





import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.get('token');

    this.materialGroup = new FormGroup({
      key: new FormControl(token),
      type: new FormControl(''),
      group_name: new FormControl(''),
      group_id: new FormControl(''),
    });

    this.showMaterial();
  }

  ngAfterViewInit() {
    // Initialize sorting and pagination after view is initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   // Function to apply the filter
   applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Set the filterPredicate before applying the filter
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const materialName = data.material_name ? data.material_name.toLowerCase() : ''; // Correct key names
      const materialGroup = data.group_name ? data.group_name.toLowerCase() : ''; // Correct key names
      const materialUnit = data.material_unit ? data.material_unit.toLowerCase() : '';
      return materialName.includes(filter) || materialGroup.includes(filter) ||  materialUnit.includes(filter);;
    };

    // Apply the filter
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
          this.totalItems = response.data?.data1.length;
          this.totalPage = Math.ceil(this.totalItems / this.pageSize);
          this.pagination();
          this.dataSource.data = this.materialGroups; // Set the data source for the table
          console.log("Material group  new is ",this.dataSource.data,"andother is ",this.materialGroups)
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
      key: '',
      type: '',
      group_name: '',
      group_id: '',
    });
  }

  materialSave() {
    // Set the type value as 'insert' before submitting the form
    this.materialGroup.patchValue({
      type: 'insert'
    });

    // Create HttpParams for URL-encoded format
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
        // Proceed with the delete action, e.g., call a service to delete the item
        console.log('Item deleted:', item);
        this.deleteMaterial(item)
        // Your delete logic here
      } else {
        console.log('Delete canceled');
      }
    });
  }


  deleteMaterial(groupId: string) {
    // Set the type value as 'delete' before submitting the form
    this.materialGroup.patchValue({
      type: 'delete'
    });

    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialGroup.get('key')?.value)
      .set('type', this.materialGroup.get('type')?.value)
      .set('group_name', this.materialGroup.get('group_name')?.value)
      .set('group_id', groupId);

    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success(response.data?.msg || 'Material Group Deleted');
          this.showMaterial();
        } else {
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



