import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccessViewsGuard  {
  constructor(
    private router: Router
  ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(localStorage.getItem('token') ==null)
      {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
  }



const routes: Routes = [
  {path : '', component : LoginComponent},
  {path : 'login', component : LoginComponent},
  {path : 'home', canActivate:[AccessViewsGuard], component : HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
