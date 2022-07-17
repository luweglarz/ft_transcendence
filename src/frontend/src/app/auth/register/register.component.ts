import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  //Data to retrieved
  registerForm = this.formBuilder.group({
    username: ['', Validators.required],
    twoFactors: [false, Validators.required],
    email: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) {
    //
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params['code'])
        this.http
          .get(`http://localhost:3000/oauth/redirect?code=${params['code']}`)
          .subscribe((response: any) => {
            console.log(response);
            localStorage.setItem('jwt', response['jwt']);
            this.router.navigate(['/register']);
          });
      else {
        const jwt = localStorage.getItem('jwt');
        if (jwt) console.log(`My jwt: ${jwt}`);
      }
    });
  }

  get twoFactors() {
    return this.registerForm.value.twoFactors;
  }

  register() {
    //Submit register informations
    console.log(this.registerForm.value);
  }
}
