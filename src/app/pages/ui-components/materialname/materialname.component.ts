import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MaterialgroupService } from 'src/app/services/materialGroup/materialgroup.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { MaterialnameService } from 'src/app/services/materialName/materialname.service';
import { UomService } from 'src/app/services/uom/uom.service';
import * as Papa from 'papaparse';
import { CsvdownloadService } from 'src/app/services/csvdownload.service';
import { Route, Router } from '@angular/router';



@Component({
  selector: 'app-materialname',
  standalone: false,
  templateUrl: './materialname.component.html',
  styleUrl: './materialname.component.scss'
})
export class MaterialnameComponent implements OnInit {
  selectedFile: File | null = null;
  parsedData: any[] = [];
  formType:any='form1';
  materialName!: FormGroup;
  filterForm!: FormGroup;
  materialGroups: any[] = [];
  filterMaterialGroups:any[]=[]
  materialTableData : any[]=[];
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
    private router: Router
  ) { }

  ngOnInit(): void {

    const token = this.cookieService.get('token');
    this.key = token;
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
      materialGroup:  new FormControl(''),
      materialName:  new FormControl(''),
      transactionDate:  new FormControl('')
    });

    this.showMaterial();
    this.showMaterialName();
    this.showMaterialUom();
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


    parseCSV(file: File): void {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;
        Papa.parse(csvData, {
          complete: (result) => {
            this.parsedData = result.data;
            console.log('Parsed Data:', this.parsedData);
          },
          header: true,
        });
      };
      reader.readAsText(file);
    }


  showMaterial() {


    // Create HttpParams for URL-encoded format
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

          console.log("material groups is ", this.materialGroups)
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


    // Create HttpParams for URL-encoded format
    let params = new HttpParams()
      .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)

    // Make HTTP call and rely on the service to handle headers
    this.uomService.getUomList(params.toString()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.uomList = response.data?.data1 || []; // Assign the material groups to the local array
          console.log("uom items is ", this.uomList)
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
          this.totalItems= response.data?.data1.length;
          this.totalPages=Math.ceil(this.totalItems / this.pageSize)
          this.paginateData()
          console.log("material data is ", this.materialTableData)
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

  // setPageSize(size: number) {
  //   this.pageSize = size;
  //   this.currentPage = 1;
  //   this.paginateData();
  // }


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
    // Ensure form is valid before submitting
    if (this.materialName.valid) {
      // Create HttpParams for URL-encoded format
      let params = new HttpParams()


        .set('key', this.materialName.get('key')?.value)
      .set('type', this.materialName.get('type')?.value)
      // .set('material_unit', this.materialName.get('material_unit')?.value)
      .set('group_id', this.materialName.get('materialgroup')?.value)
      .set('material_name', this.materialName.get('materialname')?.value)
      .set('munitid',this.materialName.get('uom')?.value)
      .set('material_description', this.materialName.get('des')?.value)
      .set('material_id', this.materialName.get('id')?.value)


      // Make HTTP call and rely on the service to handle headers
      this.materialnameService.updateMaterialName(params.toString()).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            const message = response.data?.msg || 'Material Group Updated';
            this.toastr.success(message);
            this.resetForm(); // Reset form after successful update
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
        }  else if(response.message[0].status == 101){
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
    console.log("abcde")
    if (!this.selectedFile) {
      this.toastr.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('key',this.key); // Add the key
    formData.append('file', this.selectedFile as File); // Attach the actual file

    console.log('Submitting form data:', formData);
    console.log('Submitting form data:', formData);

    this.materialnameService.materialNamecsv(formData).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.toastr.success('File uploaded successfully');
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
    console.log("item is ",item)
    // Patch the form fields with the values from the selected row
    this.materialName.patchValue({
      materialgroup: item.group_id, // Patch group_name from the item
      materialname: item.material_name, // Use item.id for group_id
      uom:item.munitid,
      des:item.material_description,
      type: 'update' ,// Set type as 'update'
      id:item.id
    });
    console.log("updated materialNamae",this.materialName)

    // Set isUpdating to true to hide the submit button
    this.isUpdating = true;
  }

  resetForm() {
    this.isUpdating = false;
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
