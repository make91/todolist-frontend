import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns count of checked items
 */
@Pipe({
  name: 'checked'
})
export class CheckedPipe implements PipeTransform {

  transform(value: any): number {
    if (!(value && value.length)) {
      return 0;
    }
    return value.filter((item: any) => item.checked).length || 0;
  }

}
