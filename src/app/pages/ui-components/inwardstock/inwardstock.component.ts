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
  inwardListData:any[]=[];
  isUpdating:boolean=false;


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


  updateInward(item: any) {
    console.log("item is ",item)
    // Patch the form fields with the values from the selected row
    this.inwardForm.patchValue({
      materialgroup: item.group_id,
      invoice: item.invoice_no,
      quantity: item.qty,
      invoicedate: item.invoice_date,
      transdate: item.transition_date,
      materialname: item.item_id,
      nooforders:item.outward_orders

    });
    console.log("updated materialNamae",this.inwardForm)

    // Set isUpdating to true to hide the submit button
    this.isUpdating = true;
  }

  onUpdate() {

    const reorderedPayload = {

      type:"inwardupdate",
      stockid:'23',
      key: this.cookieService.get('token'),


    };

    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          console.log(response)

          this.toastr.success('Invard updated successfully');

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


  inwardSubmit() {
    console.log("Inward Form Values:", this.inwardForm.value);

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


  inwardList() {

    const reorderedPayload = {

      type:"selectinward",
      key: this.cookieService.get('token'),


    };
    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          console.log(response)

  this.inwardListData=response.data.data1

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
    this.inwardList()
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


  resetForm() {
    this.inwardForm.reset({
      materialgroup: '',
      materialname:'',
      invoice: '',
      quantity: '',
      invoicedate: '',
      transdate: '',
    })
  }

}
