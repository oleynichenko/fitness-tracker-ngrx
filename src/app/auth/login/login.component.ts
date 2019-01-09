import { Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription, Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {AuthService} from '../auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService,
              private store: Store<fromApp.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromApp.getIsLoading);

    this.loginForm = new FormGroup({
      'email': new FormControl(
        'test@test.com',
        [
          Validators.required,
          Validators.email
        ]
      ),
      'password': new FormControl(
        '111111',
        Validators.required
      )
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }
}
