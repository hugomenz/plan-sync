import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RightSidebarComponent } from './right-side-bar/right-sidebar.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfViewerComponent,
    ToolbarComponent,
    RightSidebarComponent,
    LeftSidebarComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
