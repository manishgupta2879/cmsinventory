import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvdownloadService {
  constructor() {}

  downloadCSV(data: any[], filename: string): void {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);

    return array
      .map(row => Object.values(row).join(','))
      .join('\n');
  }
}

