import { Component, Input } from '@angular/core';
import { DataService } from '../data.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin } from 'rxjs';
import { map, first, mergeMap } from 'rxjs/operators';

/**
 * Component for app settings, opened as a modal
 *
 * Currently only has button for deleting all checked items
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  @Input() todos!: Observable<any[]>;

  deleteSuccess = false;

  constructor(
    private dataService: DataService,
    public activeModal: NgbActiveModal,
  ) {}

  deleteChecked() {
    this.todos.pipe(
      // Filter only checked todos
      map(res => res.filter((item: any) => !!item.checked)),
      // Join requests together, completing when all done
      mergeMap(res => forkJoin(res.map((item: any) => {
        // Delete todo observable, returned to forkJoin
        return this.dataService.deleteTodo(item._id);
      }))),
      // Get response only one time
      first(),
    ).subscribe(() => {
      // Show delete success message
      this.deleteSuccess = true;
      // Refresh data
      this.dataService.refreshData();
    });
  }
}
