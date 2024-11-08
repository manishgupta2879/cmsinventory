import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';

@Component({
  selector: 'app-inwardstock',
  standalone: false,
  templateUrl: './inwardstock.component.html',
  styleUrl: './inwardstock.component.scss'
})
export class InwardstockComponent implements OnInit {
  materialName!: FormGroup;
  inwardForm!: FormGroup;
  materialGroups: any[] = [];
  material:any[]=[];
  selectedMaterialGroupId:any='';
  selectedMaterialNameId:any='';


  constructor(
    private materialgroup: MaterialgroupService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private materialnameService: MaterialnameService,

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
          this.materialGroups = response.data?.data1 || [];
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


  getMaterial(event: Event) {

    const selectElement = event.target as HTMLSelectElement;
  const selectedGroupId = selectElement.value;
  console.log("Selected Group ID:", selectedGroupId);

this.selectedMaterialGroupId = selectedGroupId;

    this.materialName.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });


    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      // .set('group_name', this.materialName.get('group_name')?.value)
      // .set('group_id', this.materialName.get('materialgroup')?.value)
      .set('group_id', selectedGroupId);
    this.materialnameService.getMaterialNameByGroup(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.material = response.data?.data1 || [];
          console.log("material  is ", this.material)
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

  getMaterialName(event:Event){
    const selectElement = event.target as HTMLSelectElement;
    const selectedMaterialId = selectElement.value;
    console.log("selectedMaterial ID:", selectedMaterialId);

  this.selectedMaterialNameId = selectedMaterialId;
  }

  inwardSubmit() {
    console.log("Inward Form Values:", this.inwardForm.value);

    const reorderedPayload = {
      invoice: this.inwardForm.value.invoice,
      invoicedate: this.inwardForm.value.invoicedate,
      materialgroup: this.inwardForm.value.materialgroup,
      materialname: this.inwardForm.value.materialname,
      quantity: this.inwardForm.value.quantity,
      transdate: this.inwardForm.value.transdate,
      type:"inward"
    };

    this.materialnameService.createInward(reorderedPayload).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success('Invard added successfully');
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



  ngOnInit(): void {
    const token = this.cookieService.get('token');
    this.inwardForm = new FormGroup({
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      invoice: new FormControl(''),
      quantity: new FormControl(''),
      invoicedate: new FormControl(''),
      transdate: new FormControl(''),

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

    this.showMaterial();
  }

}
