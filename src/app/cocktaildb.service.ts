import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CocktaildbService {

  constructor(private http : HttpClient) { }
  getRandomCocktail(){
    return this.http.get('/cocktail/api/json/v1/1/random.php');
  };
}