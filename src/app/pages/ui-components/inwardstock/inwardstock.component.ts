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
  filterMaterialGroups :any[]=[];
  material:any[]=[];
  selectedMaterialGroupId:any='';
  selectedMaterialNameId:any='';
  inwardListData:any[]=[];
  totalPages:number=0;
  currentPage:number=1;
  totalItems:number=0;
  pageSize:number=2;
  filterForm!: FormGroup;
  paginatedData:any[]=[];
  isUpdating:boolean=false;
  stockId:any='';
  filterType:any='';
  itemId:any='';
  transDate:any=''


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
          this.materialGroups = response.data?.data1 || [] ;
          this.filterMaterialGroups = response.data?.data1 ;

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



  deleteInward(item:any){

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

            this.toastr.success('Inward deleted successfully');
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



  updateInward(item: any) {
    this.getMaterialNameBasedOnGroup(item.group_id,item);
    console.log("item is ",item)
    this.stockId = item.id;


  }


  getMaterialNameBasedOnGroup(groupId: string,item:any) {
    this.selectedMaterialGroupId = groupId; // Store selected group

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
            this.inwardForm.patchValue({
                materialgroup: item.group_id,
                invoice: item.invoice_no,
                quantity: item.qty,
                invoicedate: item.invoice_date,
                transdate: item.transition_date,
                materialname: item.item_id,
                nooforders: item.outward_orders
            });
            console.log("updated materialName", this.inwardForm);
        }, 0);

          console.log("updated materialNamae",this.inwardForm)

          this.isUpdating = true;

        } else {
          this.toastr.error('Failed to retrieve materials');
        }
      },
      (error: any) => {
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }

  onUpdate() {



    const reorderedPayload = {
      invoice_no: this.inwardForm.value.invoice,
      invoice_date: this.inwardForm.value.invoicedate,
      group_id: this.inwardForm.value.materialgroup,
      item_id: this.inwardForm.value.materialname,
      qty: this.inwardForm.value.quantity,
      trans_date: this.inwardForm.value.transdate,
      type:"inwardupdate",
      key: this.cookieService.get('token'),
      stockid:this.stockId,
      nooforders:''


    };
    console.log("full value is ",this.inwardForm.value)

    const httpParams = new HttpParams({ fromObject: reorderedPayload });


    this.materialnameService.createInward(httpParams.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          console.log(response)

          this.toastr.success('Inward updated successfully');
          this.inwardList();
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
    console.log("dat is ", this.transDate)


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
          console.log(response)

  this.inwardListData=response.data.data1 || [];
  this.totalItems = response.data.data1.length;
  this.totalPages = Math.ceil(this.totalItems/this.pageSize);
  this.pagination()

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


  pagination(){
    const startIndex = (this.currentPage -1)* this.pageSize;
    const endIndex = startIndex+this.pageSize;
    this.paginatedData = this.inwardListData.slice(startIndex,endIndex)
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

    });

    this.filterForm = new FormGroup({
      filtermaterialGroup:  new FormControl(''),
      item_id:  new FormControl(''),
      trans_date:  new FormControl('')
    });

    this.showMaterial();
  }

  applyfilter(type:any){
    this.filterType=type
  const abc=  this.filterForm.value
  this.itemId = this.filterForm.get('item_id')?.value;
  this.transDate = this.filterForm.get('trans_date')?.value;
  console.log("filter is ", abc)
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
  }

}
