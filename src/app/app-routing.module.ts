import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPropertyComponent } from './pages/add-property/add-property.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PropertyDetailsComponent } from './pages/property-details/property-details.component';
import { ReceivedBidComponent } from './pages/received-bid/received-bid.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserBidComponent } from './pages/user-bid/user-bid.component';
import { AuthGuard } from './_guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'profile',
    component: ProfileComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'home',
    component: HomeComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'add-property',
    component: AddPropertyComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'properties/:id',
    component: PropertyDetailsComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'bids',
    component: UserBidComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'received-bids',
    component: ReceivedBidComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
