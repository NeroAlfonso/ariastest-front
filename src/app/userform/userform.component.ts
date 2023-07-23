import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
export interface RoleInt
{
  id: number;
  name: string;
}
@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserformComponent {
  constructor(
    private dialogRef: MatDialogRef<UserformComponent>, 
    private fb : UntypedFormBuilder, 
    private apiService: ApiService, 
    private snackBar : MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}
  public roles : RoleInt[]=[];
  public loading : boolean =false;
  public hidePass : boolean =true;
  public formNewUser = this.fb.group({
    id: [null],
    rolename: [null],
    username: ['',[Validators.required]],
    password: ['',[Validators.required]],
    email:    ['',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    fullName: ['',[Validators.required]],
    roleid:   ['',[Validators.required]]
  });
  saveUser()
  {
    let payload :any=this.formNewUser.value;
    this.loading =true;
    this.apiService.saveUser(payload)
    .subscribe((data: any)=>
      {
        this.loading =false;
        this.snackBar.open('Operación ejecutada correctamente', 'cerrar', {duration: 3000});
        this.dialogRef.close(true)
      },
      (error : HttpErrorResponse) =>
      {
        this.loading =false;
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
  ngOnInit()
  {
    this.apiService.getRoles()
    .subscribe((data: any)=>
      {
        this.roles =data;
        if(this.data !=null)
        {
          this.data['password'] =-1;
          this.formNewUser.setValue(this.data);
        }
      },
      (error : HttpErrorResponse) =>
      {
        let msg : string ='Error general';
        switch(error.status)
        {
          case 404:
            msg ='Roles no encontrados';
            break;
          case 401:
            msg ='Operación no autorizada';
        }   
        this.snackBar.open(msg, 'cerrar', {duration: 3000});
        this.dialogRef.close(false);
      }
  )
  }
}
