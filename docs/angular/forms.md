# Angular Forms

## Template-Driven Forms

### Basic Setup
```typescript
// app.module.ts
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule
  ]
})
```

### Basic Form
```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <div>
    <label>Email:</label>
    <input type="email" name="email" ngModel required email>
  </div>
  
  <div>
    <label>Password:</label>
    <input type="password" name="password" ngModel required>
  </div>
  
  <button type="submit" [disabled]="!loginForm.form.valid">Login</button>
</form>
```

### Two-way Binding
```html
<input [(ngModel)]="user.name" name="name">
```

## Reactive Forms

### Setup
```typescript
// app.module.ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule
  ]
})
```

### Basic Form
```typescript
// In component
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}
```

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <div>
    <label>Email:</label>
    <input type="email" formControlName="email">
    <div *ngIf="loginForm.get('email').errors?.required && loginForm.get('email').touched">
      Email is required
    </div>
  </div>
  
  <div>
    <label>Password:</label>
    <input type="password" formControlName="password">
  </div>
  
  <button type="submit" [disabled]="!loginForm.valid">Login</button>
</form>
```

### Form Arrays
```typescript
// In component
export class OrderFormComponent {
  orderForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      items: this.fb.array([this.createItem()])
    });
  }
  
  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }
  
  get items() {
    return this.orderForm.get('items') as FormArray;
  }
  
  addItem() {
    this.items.push(this.createItem());
  }
  
  removeItem(index: number) {
    this.items.removeAt(index);
  }
}
```

### Custom Validators
```typescript
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

// Usage
this.heroForm = this.fb.group({
  name: ['', [
    Validators.required,
    forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator
  ]]
});
```

### Dynamic Forms
```typescript
// In component
export class DynamicFormComponent {
  form: FormGroup;
  fields = [
    { type: 'text', name: 'firstName', label: 'First Name', required: true },
    { type: 'email', name: 'email', label: 'Email', required: true },
    { type: 'password', name: 'password', label: 'Password', required: true }
  ];

  constructor(private fb: FormBuilder) {
    const group = {};
    this.fields.forEach(field => {
      group[field.name] = ['', field.required ? Validators.required : []];
    });
    this.form = this.fb.group(group);
  }
}
```

### Form Submission with HTTP
```typescript
// In component
export class UserFormComponent {
  userForm: FormGroup;
  
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  onSubmit() {
    if (this.userForm.valid) {
      this.http.post('/api/users', this.userForm.value).subscribe(
        response => console.log('Success!', response),
        error => console.error('Error!', error)
      );
    }
  }
}
```

### Cross-Field Validation
```typescript
// In component
this.form = this.fb.group({
  password: ['', [Validators.required]],
  confirmPassword: ['', [Validators.required]]
}, { validator: this.passwordMatchValidator });

passwordMatchValidator(g: FormGroup) {
  return g.get('password').value === g.get('confirmPassword').value
    ? null : { 'mismatch': true };
}
```

### Form Status Changes
```typescript
// In component
ngOnInit() {
  this.form.statusChanges.subscribe(status => {
    console.log('Form status:', status);
  });
  
  this.form.get('email').valueChanges.subscribe(value => {
    console.log('Email changed to:', value);
  });
}
```
