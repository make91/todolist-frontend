import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { DataService } from './data.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './settings/settings.component';

/**
 * Main component, contains header with input for new items, settings button, and
 * list of items, which is automatically scrolled to bottom when an item is added
 *
 * Handles new item submits, if there are line breaks, will add each line individually
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  list!: Observable<any[]>;
  inputValue = '';
  itemEditBeginEventsSubject = new Subject<string>();
  itemEditBeginEvents!: Observable<string>;
  scrollToEndOnUpdate = false;

  @ViewChild('listContent') listContent!: ElementRef;

  constructor(
    private dataService: DataService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.list = this.dataService.getTodos().pipe(
      map(res => res.results),
      // Scroll to end if requested
      tap(() => this.scrollToEndOnUpdate && this.scrollToEnd()),
    );
    this.itemEditBeginEvents = this.itemEditBeginEventsSubject.asObservable().pipe(
      // Share to all subscribers
      share(),
    );
  }

  onSubmit() {
    const inputValue = this.inputValue.trim();
    if (!inputValue) {
      return;
    }
    // Check if linebreaks exist
    // This way can add multiple items at once, e.g. from copy paste
    const lines = inputValue.split(/\r?\n/)
      // Trim lines
      .map(value => value.trim())
      // Remove empty lines
      .filter(value => value);
    // Add all lines in separate requests
    forkJoin(lines.map(line => this.dataService.addTodo(line))).subscribe(response => {
      // After all requests done, refresh data
      this.dataService.refreshData();
      // Request that should be scrolled to end on update
      this.scrollToEndOnUpdate = true;
    });
    // Reset the input value
    this.inputValue = Object.assign('', '');
  }

  trackByFunction(index: number, item: any) {
    return item._id;
  }

  scrollToEnd() {
    this.scrollToEndOnUpdate = false;
    setTimeout(() => {
      // Scroll to end after small wait
      this.listContent.nativeElement.scrollTop = this.listContent.nativeElement.scrollHeight;
    }, 10);
  }

  openSettings() {
    const modalRef = this.modalService.open(SettingsComponent);
    modalRef.componentInstance.todos = this.list;
  }
}
