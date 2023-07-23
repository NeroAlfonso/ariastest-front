import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserformComponent } from '../userform/userform.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CocktaildbService } from '../cocktaildb.service';
export interface UserInt
{
  id: number;
  username: string;
  fullName: string;
  email: string;
  roleid: number;
  rolename: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{
  public userList : MatTableDataSource<UserInt> =new MatTableDataSource<UserInt>();
  public tokenPay : any ={};
  public currentCocktail : any ={};
  @ViewChild('paginator') paginator: MatPaginator | null =null;
  @ViewChild(MatSort) sort: MatSort | null =null;
  public displayedColumns : string[] =['id', 'username', 'fullname', 'email', 'rolename', 'controls'];
  constructor(
    public dialog: MatDialog, 
    private apiService :ApiService, private router : Router, private snackBar : MatSnackBar,
    private cocktaildbService :CocktaildbService)
  {
   
  }
  deleteUser(usrId : number)
  {
    let dialogRef =this.dialog.open(ConfirmDialogComponent,{});
    dialogRef.afterClosed()
    .subscribe(
      result => {
        if(result)
        {
          this.apiService.deleteUser(usrId)
          .subscribe((data: any)=>
            {
              this.snackBar.open('Usuario eliminado con éxito', 'cerrar', {duration: 3000});
              this.loadUsers();
            },
            (error : HttpErrorResponse) =>
            {
              let msg : string ='Error general';
              switch(error.status)
              {
                case 404:
                  msg ='Usuario no encontrados';
                  break;
                case 401:
                  msg ='Operación no autorizada';
              }   
              this.snackBar.open(msg, 'cerrar', {duration: 3000});
            }
          )
        }
      }
    );
  }
  loadUsers()
  {
    this.apiService.getUsers()
    .subscribe((data: any)=>
      {
        this.userList.data = data;
      },
      (error : HttpErrorResponse) =>
      {
        let msg : string ='Error general';
        switch(error.status)
        {
          case 404:
            msg ='Usuarios no encontrados';
            break;
          case 401:
            msg ='Operación no autorizada';
        }   
        this.snackBar.open(msg, 'cerrar', {duration: 3000});
      }
    )
  }
  ngAfterViewInit()
  {
    this.userList.paginator = this.paginator;
    this.userList.sort = this.sort;
    this.loadRandomCocktail();
    this.loadUsers();
  }
  newCocktail()
  {
    this.loadRandomCocktail();
  }
  loadRandomCocktail()
  {
    this.cocktaildbService.getRandomCocktail()
    .subscribe((data: any)=>
      {
        this.currentCocktail =data['drinks'][0];
      },
      (error : HttpErrorResponse) =>
      {
        let msg : string ='Error general';
        switch(error.status)
        {
          case 404:
            msg ='Coctel no encontrados';
            break;
          case 401:
            msg ='Operación no autorizada';
        }   
        this.snackBar.open(msg, 'cerrar', {duration: 3000});
      }
    ) 
  }
  verifyToken()
  {
    let token : string | null = localStorage.getItem('token');
    if(token ==null)
    {
      this.router.navigate(['/login']);
    }
  }
  ngOnInit()
  {
    let token : string | null =localStorage.getItem('token');
    if(token !=null)
    {
      this.tokenPay =jwt_decode(token);
    }
  }
  exit()
  {
   localStorage.removeItem('token');
   this.verifyToken();
  }
  openUserForm(userData :any)
  {
    let dialogReference =this.dialog.open(UserformComponent, {
      data: userData
    });
    dialogReference.afterClosed().subscribe(
      result => {
        if(result)
        {
          this.loadUsers();
        }
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userList.filter = filterValue.trim().toLowerCase();
    if (this.userList.paginator) {
      this.userList.paginator.firstPage();
    }
  }
}
