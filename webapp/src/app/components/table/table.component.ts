import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from '../../directives/infinity-scroll.directive';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'date' | 'badge' | 'custom';
  format?: string;
  customTemplate?: TemplateRef<any>;
}

export interface TableConfig {
  columns: TableColumn[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  showPagination?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  totalItems?: number;
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  enableRowClick?: boolean;
  showActions?: boolean;
  cursor?: string;
  nextCursor?: string;
  previousCursor?: string;
  hasMore?: boolean;
}

export interface TableSortEvent {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TablePageEvent {
  page?: number;
  itemsPerPage?: number;
  cursor?: string;
  direction?: 'next' | 'previous';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() config: TableConfig = { columns: [] };
  @Input() itemTemplate?: TemplateRef<any>;

  @Output() sort = new EventEmitter<TableSortEvent>();
  @Output() pageChange = new EventEmitter<TablePageEvent>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string; item: any }>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();

  get paginatedData() {
    return this.data;
  }

  get totalPages() {
    return 1;
  }

  onSort(field: string) {
    const column = this.config?.columns?.find((col) => col.key === field);
    if (!column?.sortable) return;

    const newDirection =
      this.config?.sortField === field && this.config?.sortDirection === 'asc' ? 'desc' : 'asc';

    this.sort.emit({
      field: field,
      direction: newDirection,
    });
  }

  getHeaderClass(column: TableColumn): string {
    let classes = 'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ';

    if (column.sortable) {
      classes += 'cursor-pointer hover:bg-gray-100 transition-colors ';
    }

    if (column.align === 'center') {
      classes += 'text-center';
    } else if (column.align === 'right') {
      classes += 'text-right';
    } else {
      classes += 'text-left';
    }

    return classes;
  }

  getDisplayValue(item: any, column: TableColumn): any {
    return item[column.key];
  }

  getBadgeClass(value: any): string {
    return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
  }

  onPageChange(direction: 'next' | 'previous', cursor?: string) {
    this.pageChange.emit({
      itemsPerPage: this.config.itemsPerPage || 10,
      cursor: cursor,
      direction: direction,
    });
  }

  onLoadMore() {
    console.log('[ON] Load More', this.config.hasMore);
    if (this.config.hasMore) {
      this.onPageChange('next');
    }
  }

  onRowClick(item: any) {
    if (this.config?.enableRowClick !== false) {
      this.rowClick.emit(item);
    }
  }

  onEditClick(item: any, event: Event) {
    event.stopPropagation();
    this.editClick.emit(item);
  }

  onDeleteClick(item: any, event: Event) {
    event.stopPropagation();
    this.deleteClick.emit(item.id);
  }

  onActionClick(action: string, item: any, event: Event) {
    event.stopPropagation();
    this.actionClick.emit({ action, item });
  }

  getCellValue(item: any, column: TableColumn): any {
    const value = this.getNestedValue(item, column.key);

    if (column.type === 'date' && value) {
      return new Date(value);
    }

    return value;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  trackByIndex(index: number): number {
    return index;
  }

  get Math() {
    return Math;
  }
}
