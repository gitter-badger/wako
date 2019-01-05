import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/services/app/app.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private appService: AppService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.appService.login().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
