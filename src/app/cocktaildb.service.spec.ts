import { TestBed } from '@angular/core/testing';

import { CocktaildbService } from './cocktaildb.service';

describe('CocktaildbService', () => {
  let service: CocktaildbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocktaildbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
