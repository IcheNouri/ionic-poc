import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Dayjs } from 'dayjs';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  constructor(private translateService: TranslateService) {}

  public streamLocalizedShortDate(date: Dayjs): Observable<string> {
    return this.translateService.onLangChange.pipe(
      map(langChangeEvent => langChangeEvent.lang),
      startWith(this.translateService.currentLang),
      map(currentLang => (currentLang === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY')),
      map(format => date.format(format))
    );
  }
}
