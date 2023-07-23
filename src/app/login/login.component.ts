import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar'
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public hidePass : boolean =false;
  constructor(private router : Router, private apiService : ApiService, private fb : UntypedFormBuilder, private snackbar: MatSnackBar)
  {
    
  }
  public formLogin = this.fb.group({
    username:['',[Validators.required]],
    password:     ['',[Validators.required]]
  });
  title = 'ariastest'
  login()
  {
    if(!this.formLogin.valid)
    {
      alert('¡Faltan valores!');
    }
    else
    {
      this.apiService.login(this.formLogin.value)
      .subscribe((data: any)=>
      {
        localStorage.setItem('token', data.token);
        this.router.navigate(['/home']);
      },
      (error : HttpErrorResponse) =>
      {
        let msg : string ='Error general';
        switch(error.status)
        {
          case 404:
            msg ='Usuario no encontrado';
            break;
        }   
        this.snackbar.open(msg, 'cerrar', {duration: 3000});
      }
  )
    }
  }
  ngOnInit()
  {
    let token : string | null =localStorage.getItem('token');
    if(token != null)
    {
      this.router.navigate(['/home']);
    }
  }
}
