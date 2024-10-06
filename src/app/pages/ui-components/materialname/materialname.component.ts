import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';
import { UomService } from 'src/app/services/uom/uom.service';


@Component({
  selector: 'app-materialname',
  standalone: false,
  templateUrl: './materialname.component.html',
  styleUrl: './materialname.component.scss'
})
export class MaterialnameComponent implements OnInit {
  materialName!: FormGroup;
  materialGroups: any[] = [];
  materialTableData : any[]=[];
  isUpdating :boolean = false;
uomList:any[]=[];
  constructor(
    private materialgroup: MaterialgroupService,
    private uomService:UomService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private materialnameService: MaterialnameService,



  ) { }

  ngOnInit(): void {
    const token = this.cookieService.get('token');
    this.materialName = new FormGroup({
      key: new FormControl(token),
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      uom: new FormControl(''),
      des:new FormControl(''),
      type:new FormControl('select'),

    })

    this.showMaterial();
    this.showMaterialName();
    this.showMaterialUom();
  }


  showMaterial() {
    // Set the type value as 'select' before submitting the form
    // this.materialName.patchValue({
    //   type: 'select',
    //   key: this.cookieService.get('token'),
    // });

    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_name', this.materialName.get('group_name')?.value)
      .set('group_id', this.materialName.get('group_id')?.value);

    // Make HTTP call and rely on the service to handle headers
    this.materialgroup.userLogin(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          // this.toastr.success(response.data?.msg || 'Material Group Created');
          this.materialGroups = response.data?.data1 || []; // Assign the material groups to the local array
          console.log("material groups is ", this.materialGroups)
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


  showMaterialUom() {
    // Set the type value as 'select' before submitting the form
    // this.materialName.patchValue({
    //   type: 'select',
    //   key: this.cookieService.get('token'),
    // });

    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)

    // Make HTTP call and rely on the service to handle headers
    this.uomService.getUomList(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          // this.toastr.success(response.data?.msg || 'Material Group Created');
          this.uomList = response.data?.data1 || []; // Assign the material groups to the local array
          console.log("uom items is ", this.uomList)
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


  showMaterialName() {
    // Set the type value as 'select' before submitting the form
    this.materialName.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });

    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)

    // Make HTTP call and rely on the service to handle headers
    this.materialnameService.getMaterialName(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          // this.toastr.success(response.data?.msg || 'Material Group Created');
          this.materialTableData = response.data?.data1 || []; // Assign the material groups to the local array
          console.log("material data is ", this.materialTableData)
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

  createMaterialName() {
    // Set the type value as 'insert' before submitting the form
    this.materialName.patchValue({
      type: 'insert'
    });

    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('material_unit', this.materialName.get('uom')?.value)
      .set('group_id', this.materialName.get('materialgroup')?.value)
      .set('material_name', this.materialName.get('materialname')?.value)
      .set('material_description', this.materialName.get('des')?.value);


    // Make HTTP call and rely on the service to handle headers
    this.materialnameService.createMaterialName(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const message = response.data?.msg || 'Material Group Created';
          this.toastr.success(message);
          this.resetForm();
          // this.showMaterial();
          const data = response.data;
          console.log('Key:', data);
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


  updateMaterialName(item: any) {
    console.log("item is ",item)
    // Patch the form fields with the values from the selected row
    this.materialName.patchValue({
      materialgroup: item.group_id, // Patch group_name from the item
      materialname: item.material_name, // Use item.id for group_id
      uom:item.material_unit,
      des:item.material_description,
      type: 'update' // Set type as 'update'
    });

    // Set isUpdating to true to hide the submit button
    this.isUpdating = true;
  }

  resetForm() {
    this.materialName.reset({
      key: '',
      type: '',
      materialgroup: '',
      materialname: '',
      uom:'',
      des:''
    })
  }

}
