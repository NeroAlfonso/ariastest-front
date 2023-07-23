import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http : HttpClient) { }
  deleteUser(usrId: number)
  {
    return this.http.delete('/api/users/'+usrId);
  }
  saveUser(body: any)
  {
    if(body.id !=null)
    {//edita el usuario
      console.log('====Editandoodododo');
      return this.http.put('/api/users/'+body.id, body);
    }
    return this.http.post('/api/users', body);
  }
  login(body : any){
    return this.http.post('/api/login', body);
  };
  getUsers(){
    return this.http.get('/api/users');
  };
  getRoles(){
    return this.http.get('/api/roles');
  };
}
