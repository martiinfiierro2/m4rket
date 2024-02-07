import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPromo'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Personaliza esta lógica según tus necesidades
      return item.nombre.toLowerCase().includes(searchText);
    });
  }
}
