import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-materialgroup',
  standalone: false,
  templateUrl: './materialgroup.component.html',
  styleUrl: './materialgroup.component.scss'
})
export class MaterialgroupComponent implements OnInit {
  materialGroup!: FormGroup;
  materialGroups: any[] = [];
  isUpdating: boolean = false;

  constructor(
    private cookieService: CookieService,
    private toastr: ToastrService,
    private materialgroup: MaterialgroupService,
  ) { }

  ngOnInit(): void {
    const token = this.cookieService.get('token');

    this.materialGroup = new FormGroup({
      key: new FormControl(token),
      type: new FormControl(''),
      group_name: new FormControl(''),
      group_id: new FormControl(''),
    })

    this.showMaterial();
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

    // Make HTTP call and rely on the service to handle headers
    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const message = response.data?.msg || 'Material Group Created';
          this.toastr.success(message);
          this.resetForm();
          this.showMaterial();
          const key = response.data?.key;
          console.log('Key:', key);
        } else {
          this.toastr.error('Failed to Create');
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }


  updateMaterial(item: any) {
    // Patch the form fields with the values from the selected row
    this.materialGroup.patchValue({
      group_name: item.group_name, // Patch group_name from the item
      group_id: item.id, // Use item.id for group_id
      type: 'update' // Set type as 'update'
    });

    // Set isUpdating to true to hide the submit button
    this.isUpdating = true;
  }

  onUpdate() {
    // Ensure form is valid before submitting
    if (this.materialGroup.valid) {
      // Create HttpParams for URL-encoded format
      let params = new HttpParams()
        .set('key', this.materialGroup.get('key')?.value)
        .set('type', this.materialGroup.get('type')?.value)
        .set('group_name', this.materialGroup.get('group_name')?.value)
        .set('group_id', this.materialGroup.get('group_id')?.value);

      // Make HTTP call and rely on the service to handle headers
      this.materialgroup.userLogin(params.toString()).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            const message = response.data?.msg || 'Material Group Updated';
            this.toastr.success(message);
            this.resetForm(); // Reset form after successful update
            const key = response.data?.key;
            this.showMaterial();
            console.log('Key:', key);
          } else {
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

  showMaterial() {
    // Set the type value as 'select' before submitting the form
    this.materialGroup.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });

    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialGroup.get('key')?.value)
      .set('type', this.materialGroup.get('type')?.value)
      .set('group_name', this.materialGroup.get('group_name')?.value)
      .set('group_id', this.materialGroup.get('group_id')?.value);

    // Make HTTP call and rely on the service to handle headers
    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          // this.toastr.success(response.data?.msg || 'Material Group Created');
          this.materialGroups = response.data?.data1 || []; // Assign the material groups to the local array
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

  deleteMaterial(groupId: string) {
    // Set the type value as 'delete' before submitting the form
    this.materialGroup.patchValue({
      type: 'delete'
    });

    // Create HttpParams for URL-encoded format, including groupId
    let params = new HttpParams()
      .set('key', this.materialGroup.get('key')?.value)
      .set('type', this.materialGroup.get('type')?.value)
      .set('group_name', this.materialGroup.get('group_name')?.value)
      .set('group_id', groupId); // Use groupId passed to this function

    // Make HTTP call and rely on the service to handle headers
    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success(response.data?.msg || 'Material Group Deleted');
          this.materialGroups = response.data?.data1 || []; // Refresh the list after deletion
          this.showMaterial();
        } else {
          this.toastr.error('Failed to delete material group');
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }



  resetForm() {
    this.isUpdating = false;
    this.materialGroup.reset({
      key: '',
      type: '',
      group_name: '',
      group_id: '',
    })
  }



}
