import { Pipe, PipeTransform } from '@angular/core';

const FMT = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

@Pipe({ name: 'currencyMxn', standalone: true })
export class CurrencyMxnPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '$0.00';
    return FMT.format(value);
  }
}
