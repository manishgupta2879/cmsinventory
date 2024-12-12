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
  filterForm!: FormGroup;
  outwardListData:any[]=[];
  isUpdating:boolean=false;
  stockId:any=''

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

  onUpdate() {

    // const reorderedPayload = {

    //   type:"inwardupdate",
    //   stockid:'23',
    //   key: this.cookieService.get('token'),


    // };

    const reorderedPayload = {
      invoice_no:'',
      invoice_date:'',
      group_id: this.outwardForm.value.materialgroup,
      item_id: this.outwardForm.value.materialname,
      qty: this.outwardForm.value.quantity,
      trans_date: this.outwardForm.value.transdate,
      type:"outwardupdate",
      key: this.cookieService.get('token'),
      stockid:this.stockId,
      nooforders:this.outwardForm.value.nooforders


    };
    console.log("full value is ",this.outwardForm.value)

    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          console.log(response)

          this.toastr.success('outward updated successfully');
          this.outwardList();
          this.resetForm();


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

  // updateOutward(item: any) {
  //   console.log("item is ",item)
  //   this.getMaterial(item.group_id)
  //   this.outwardForm.patchValue({
  //     materialgroup: item.group_id,
  //     invoice: item.invoice_no,
  //     quantity: item.qty,
  //     invoicedate: item.invoice_date,
  //     transdate: item.transition_date,
  //     materialname: item.item_id,
  //     nooforders:item.outward_orders

  //   });
  //   console.log("updated materialNamae",this.outwardForm)

  //   // Set isUpdating to true to hide the submit button
  //   this.isUpdating = true;
  // }


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
          console.log(response)

          this.toastr.success('Outward deleted successfully');
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


  updateOutward(item: any) {
    this.getMaterialNameBasedOnGroup(item.group_id,item);
    console.log("item is ",item)
    this.stockId = item.id;


  }

  getMaterialNameBasedOnGroup(groupId: string,item:any) {

    // Trigger the material fetch based on the group ID
    this.materialName.patchValue({
      type: 'select',
      key: this.cookieService.get('token'),
    });

    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      .set('group_id', groupId); // Pass the group ID to get materials of that group

    this.materialnameService.getMaterialNameByGroup(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.material = response.data?.data1 || [];
          console.log("Materials for selected group:", this.material);

          //this.inwardForm.patchValue({
            //materialname: "3",
            // materialgroup: item.group_id,
            // invoice: item.invoice_no,
            // quantity: item.qty,
            // invoicedate: item.invoice_date,
            // transdate: item.transition_date,
            // nooforders:item.outward_orders
          //});


          setTimeout(() => {
            this.outwardForm.patchValue({
                materialgroup: item.group_id,
                invoice: item.invoice_no,
                quantity: item.qty,
                invoicedate: item.invoice_date,
                transdate: item.transition_date,
                materialname: item.item_id,
                nooforders: item.outward_orders
            });
            console.log("updated materialName", this.outwardForm);
        }, 0);

          console.log("updated materialNamae",this.outwardForm)

          this.isUpdating = true;

        } else {
          this.toastr.error('Failed to retrieve materials');
          //done
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
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
    this.filterForm = new FormGroup({
      materialGroup:  new FormControl(''),
      materialName:  new FormControl(''),
      transactionDate:  new FormControl('')
    });


    this.showMaterial();
  }

  applyFilter(){

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
