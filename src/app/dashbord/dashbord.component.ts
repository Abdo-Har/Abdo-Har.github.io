import { Component, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent {
  title = 'PROJECT';
  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness' , 'price' , 'comment' , 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api : ApiService){

  }
  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val ==='save'){
        this.getAllProducts();
      }
    })
  }
  getAllProducts(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        Swal.fire({
          icon: 'warning',
          title: 'Error while fetching the records!!',
          showConfirmButton: true,
          
        })
      }
    })
  }
  editProduct(row : any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val ==='update'){
        this.getAllProducts();
      }
    })
  }
  deleteProduct(id : number){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        Swal.fire({
          icon: 'success',
          title: 'Product Deleted Succesfuly',
          showConfirmButton: false,
          timer:1500
          
        })
        
        this.getAllProducts();
      },
      error:()=>{
        Swal.fire({
          icon: 'warning',
          title: 'Error while deleting the Product !!!',
          showConfirmButton: true,
          
        })
        
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
