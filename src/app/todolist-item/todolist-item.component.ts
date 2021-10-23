import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service'
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

/**
 * Todolist item component, contains checkbox and text
 *
 * When text is clicked, opens editing view, with save, delete and cancel buttons.
 * Opening editing view closes other editing views.
 */
@Component({
  selector: 'app-todolist-item',
  templateUrl: './todolist-item.component.html',
  styleUrls: ['./todolist-item.component.scss']
})
export class TodolistItemComponent implements OnInit, OnDestroy {
  @Input()
  public item: any;

  @Input()
  public itemEditEvents!: Observable<string>;

  @Output()
  public itemEditBegin: EventEmitter<string> = new EventEmitter<string>();

  public editingItem = false;
  public newText = '';

  private itemEditEventsSub!: Subscription;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.itemEditEventsSub = this.itemEditEvents.pipe(
      // Not this item
      filter(id => id !== this.item._id),
      // Close this edit if other item being edited
      tap(() => this.editItem(null)),
    ).subscribe();
  }

  ngOnDestroy() {
    this.itemEditEventsSub?.unsubscribe();
  }

  toggleChecked(item: any) {
    // Toggles checked value, initially true
    const checked = !(item.checked || false)
    this.dataService.updateTodo(item._id, { checked }).subscribe(response => {
      this.dataService.refreshData();
    });
  }

  deleteItem(item: any) {
    this.dataService.deleteTodo(item._id).subscribe(response => {
      this.dataService.refreshData();
    });
  }

  editItem(item: any) {
    if (!item) {
      this.editingItem = false;
      this.newText = '';
    } else {
      this.editingItem = true;
      // Tell parent that this item is being edited, so other edit closes
      this.itemEditBegin.emit(item._id);
    }
  }

  updateMessage(item: any) {
    const newText = this.newText.trim();
    if (!newText || newText === this.item.msg) {
      // The text must not be empty and must be different than current text
      this.editItem(null);
      return;
    }
    this.dataService.updateTodo(item._id, { msg: newText }).subscribe(response => {
      this.editItem(null);
      this.dataService.refreshData();
    });
  }
}
