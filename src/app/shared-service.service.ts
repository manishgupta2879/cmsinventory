
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  private showToggleIconSubject = new BehaviorSubject<boolean>(true);

  showToggleIcon$ = this.showToggleIconSubject.asObservable();

  setShowToggleIcon(value: boolean) {
    this.showToggleIconSubject.next(value);
  }
}
