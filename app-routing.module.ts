import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
  {path: 'Instructions', component: InstructionsComponent},
  {path: 'home', component: HeaderComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
