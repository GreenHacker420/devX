# Angular Components

## What is a Component?
A component controls a patch of screen called a view. It consists of:
- A TypeScript class (component class)
- An HTML template
- Optional CSS styles

## Creating a Component
```bash
ng generate component my-component
# or shorthand
ng g c my-component
```

## Component Structure
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponent {
  // Component logic goes here
  title = 'My Component';
}
```

## Component Lifecycle Hooks
- `ngOnInit()`: Called after the first ngOnChanges
- `ngOnChanges()`: Called when input properties change
- `ngDoCheck()`: Custom change detection
- `ngAfterViewInit()`: Called after the view is initialized
- `ngOnDestroy()`: Cleanup just before Angular destroys the component

## Component Communication

### Parent to Child: @Input()
```typescript
// parent.component.html
<app-child [message]="parentMessage"></app-child>

// child.component.ts
@Input() message: string;
```

### Child to Parent: @Output()
```typescript
// child.component.ts
@Output() notify = new EventEmitter<string>();

onClick() {
  this.notify.emit('Button clicked!');
}

// parent.component.html
<app-child (notify)="onNotify($event)"></app-child>
```

## View Encapsulation
Angular supports three view encapsulation strategies:
- `ViewEncapsulation.Emulated` (default)
- `ViewEncapsulation.None`
- `ViewEncapsulation.ShadowDom`

## Content Projection
```html
<!-- parent.component.html -->
<app-card>
  <h1>Card Title</h1>
  <p>Card content goes here</p>
</app-card>

<!-- card.component.html -->
<div class="card">
  <ng-content></ng-content>
</div>
```
