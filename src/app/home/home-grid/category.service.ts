import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {ApplicationConfigService} from '../../core/config/application-config.service';
import {CategoryDto} from './category.dto';
import {createRequestOption} from '../../core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/app');

  constructor(private httpClient: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getAllCategoriesForCurrentUser(): Observable<HttpResponse<CategoryDto[]>> {
    const options = createRequestOption({ page: 0, size: 100 });
    return this.httpClient.get<CategoryDto[]>(`${this.resourceUrl}/tags`, { params: options, observe: 'response' });
  }

  getMostUsedCategoryForCurrentUser(): Observable<HttpResponse<CategoryDto>> {
    return this.httpClient.get<CategoryDto>(`${this.resourceUrl}/tags/most-used`, { observe: 'response' });
  }

  create(currentUserUuid: string, name: string): Observable<HttpResponse<CategoryDto>> {
    const dto = {
      pro: false,
      name,
    };
    return this.httpClient.post<CategoryDto>(`${this.resourceUrl}/users/${currentUserUuid}/tags`, dto, { observe: 'response' });
  }

  rename(categoryUuid: string, name: string): Observable<HttpResponse<CategoryDto>> {
    return this.httpClient.patch<CategoryDto>(`${this.resourceUrl}/tags/${categoryUuid}`, { name }, { observe: 'response' });
  }

  delete(categoryUuid: string): Observable<HttpResponse<void>> {
    return this.httpClient.delete<void>(`${this.resourceUrl}/tags/${categoryUuid}`, { observe: 'response' });
  }
}
