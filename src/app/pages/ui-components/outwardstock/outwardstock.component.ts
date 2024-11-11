import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';

@Component({
  selector: 'app-outwardstock',
  standalone: false,
  templateUrl: './outwardstock.component.html',
  styleUrl: './outwardstock.component.scss'
})
export class OutwardstockComponent implements OnInit {
  materialGroups: any[] = [];
  material:any[]=[];
  materialName!: FormGroup;
  outwardForm!: FormGroup;
  outwardListData:any[]=[];
  isUpdating:boolean=false;

  constructor(
    private materialgroup: MaterialgroupService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private materialnameService: MaterialnameService,


  ) { }


  getMaterial(event: Event) {

    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
  const selectedGroupId = selectElement.value;
  console.log("Selected Group ID:", selectedGroupId);



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


  outwardSubmit() {
    console.log("Inward Form Values:", this.outwardForm.value);

    const reorderedPayload = {
      invoice_no: this.outwardForm.value.invoice,
      invoice_date: '',
      nooforders: this.outwardForm.value.nooforders,
      group_id: this.outwardForm.value.materialgroup,
      item_id: this.outwardForm.value.materialname,
      qty: this.outwardForm.value.quantity,
      // trans_date: this.outwardForm.value.transdate,
      trans_date: '2024-11-28',
      type:"outward",
      key: this.cookieService.get('token'),

    };
    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success('Invard added successfully');
          this.resetForm();
          this.outwardList();
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


  outwardList() {

    const reorderedPayload = {

      type:"selectoutward",
      key: this.cookieService.get('token'),


    };
    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          console.log(response)
this.outwardListData= response.data.data1
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

  onUpdate(){

  }

  updateOutward(item: any) {
    console.log("item is ",item)
    this.getMaterial(item.group_id)
    this.outwardForm.patchValue({
      materialgroup: item.group_id,
      invoice: item.invoice_no,
      quantity: item.qty,
      invoicedate: item.invoice_date,
      transdate: item.transition_date,
      materialname: item.item_id,
      nooforders:item.outward_orders

    });
    console.log("updated materialNamae",this.outwardForm)

    // Set isUpdating to true to hide the submit button
    this.isUpdating = true;
  }


  ngOnInit(): void {
    this.outwardList();
    const token = this.cookieService.get('token');

    this.outwardForm = new FormGroup({
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      transdate: new FormControl(''),
      quantity: new FormControl(''),
      orderprocess: new FormControl(''),
      nooforders: new FormControl(''),

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

  resetForm() {
    this.outwardForm.reset({
      materialgroup: '',
      materialname:'',
      invoice: '',
      quantity: '',
      invoicedate: '',
      transdate: '',
    })
  }


}
