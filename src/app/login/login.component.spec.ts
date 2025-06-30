import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty fields', () => {
    expect(component.usuario).toBe('');
    expect(component.contrasena).toBe('');
  });

  it('should validate form correctly', () => {
    // Form should be invalid when password is empty
    component.contrasena = '';
    expect(component.isFormValid()).toBeFalse();

    // Form should be valid when password has value
    component.contrasena = 'test123';
    expect(component.isFormValid()).toBeTrue();
  });

  it('should navigate to bienvenida on valid form submission', () => {
    component.contrasena = 'test123';
    component.onSubmit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bienvenida']);
  });

  it('should not navigate when form is invalid', () => {
    component.contrasena = '';
    component.onSubmit();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
