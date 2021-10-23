import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodolistItemComponent } from './todolist-item/todolist-item.component';
import { TodoInputComponent } from './todo-input/todo-input.component';
import { SettingsComponent } from './settings/settings.component';
import { CheckedPipe } from './checked.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TodolistItemComponent,
    TodoInputComponent,
    SettingsComponent,
    CheckedPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
