import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

/**
 * Textarea component for adding or changing data, is focused when initialized
 *
 * Shows arrow when there is text entered, submits on Enter key, outputs submits
 * and value changes
 */
@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss']
})
export class TodoInputComponent implements AfterViewInit {
  @Input() inputValue = "";
  @Input() placeholderText = "";
  @Input() showArrow = false;
  @Output() inputValueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitValue: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('input') input!: ElementRef;

  ngAfterViewInit() {
    // Focuses the element when element is initialized
    this.input.nativeElement.focus();
  }
}
