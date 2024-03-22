/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MonacoEditorAngularComponent } from './monaco-editor-angular.component';

@NgModule({
    declarations: [
        MonacoEditorAngularComponent,
        AppComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

}
