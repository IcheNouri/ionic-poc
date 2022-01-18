export interface SelectableItem {
  selected: boolean;
}

export class SelectionManager<T extends SelectableItem> {
  private pages: { [key: number]: T[] } = {};

  constructor(private currentPage: number, items: T[]) {
    this.pages[currentPage] = items;
  }

  changePage(newPage: number, items: T[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.pages[newPage] && this.pages[newPage].length === items.length) {
      items.forEach((item, index) => (item.selected = this.pages[newPage][index].selected));
    }
    this.pages[newPage] = items;
    this.currentPage = newPage;
  }

  toggleSelectAll(): void {
    this.areAllItemsSelected = !this.areAllItemsSelected;
  }

  unselectAll(): void {
    this.areAllItemsSelected = false;
  }

  getSelectedItems(): T[] {
    return this.currentPageItems.filter(item => item.selected);
  }

  get areSomeItemsSelected(): boolean {
    return this.currentPageItems.some(item => item.selected);
  }

  get areAllItemsSelected(): boolean {
    return this.currentPageItems.every(item => item.selected);
  }

  set areAllItemsSelected(value: boolean) {
    this.currentPageItems.forEach(item => (item.selected = value));
  }

  private get currentPageItems(): T[] {
    return this.pages[this.currentPage];
  }
}
