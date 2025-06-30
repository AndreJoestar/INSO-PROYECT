import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TablesComponent } from './tables.component';

describe('TablesComponent', () => {
  let component: TablesComponent;
  let fixture: ComponentFixture<TablesComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TablesComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TablesComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 10 tables', () => {
    expect(component.tables.length).toBe(10);
  });

  it('should have tables numbered from 1 to 10', () => {
    const tableNumbers = component.tables.map(table => table.number);
    expect(tableNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should initialize with some occupied tables', () => {
    const occupiedTables = component.tables.filter(table => table.isOccupied);
    expect(occupiedTables.length).toBeGreaterThan(0);
  });

  it('should initialize with current floor as 1', () => {
    expect(component.currentFloor).toBe(1);
  });

  it('should handle table click for available table', () => {
    spyOn(window, 'alert');
    const availableTable = component.tables.find(table => !table.isOccupied);

    if (availableTable) {
      component.onTableClick(availableTable);
      expect(window.alert).toHaveBeenCalledWith(`Mesa ${availableTable.number} (Disponible) seleccionada`);
    }
  });

  it('should handle table click for occupied table', () => {
    spyOn(window, 'alert');
    const occupiedTable = component.tables.find(table => table.isOccupied);

    if (occupiedTable) {
      component.onTableClick(occupiedTable);
      expect(window.alert).toHaveBeenCalledWith(`Mesa ${occupiedTable.number} (Ocupada) seleccionada`);
    }
  });

  it('should set selected table when table is clicked', () => {
    const table = component.tables[0];
    component.onTableClick(table);
    expect(component.selectedTable).toBe(table);
  });

  it('should change current floor', () => {
    component.onFloorChange(2);
    expect(component.currentFloor).toBe(2);
  });

  it('should navigate to login on logout', () => {
    component.logout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call clearSession on logout', () => {
    spyOn(component as any, 'clearSession');
    component.logout();
    expect((component as any).clearSession).toHaveBeenCalled();
  });

  it('should return correct table status text', () => {
    const availableTable = { number: 1, isOccupied: false, floor: 1 };
    const occupiedTable = { number: 2, isOccupied: true, floor: 1 };

    expect(component.getTableStatusText(availableTable)).toBe('Disponible');
    expect(component.getTableStatusText(occupiedTable)).toBe('Ocupada');
  });

  it('should return correct table status color', () => {
    const availableTable = { number: 1, isOccupied: false, floor: 1 };
    const occupiedTable = { number: 2, isOccupied: true, floor: 1 };

    expect(component.getTableStatusColor(availableTable)).toBe('#ffffff');
    expect(component.getTableStatusColor(occupiedTable)).toBe('#ff6b6b');
  });

  it('should count available tables correctly', () => {
    const availableCount = component.tables.filter(table => !table.isOccupied).length;
    expect(component.getAvailableTablesCount()).toBe(availableCount);
  });

  it('should count occupied tables correctly', () => {
    const occupiedCount = component.tables.filter(table => table.isOccupied).length;
    expect(component.getOccupiedTablesCount()).toBe(occupiedCount);
  });

  it('should detect if all tables are occupied', () => {
    // Inicialmente no todas las mesas están ocupadas
    expect(component.areAllTablesOccupied()).toBeFalsy();

    // Ocupar todas las mesas
    component.tables.forEach(table => table.isOccupied = true);
    expect(component.areAllTablesOccupied()).toBeTruthy();
  });

  it('should handle sidebar item clicks', () => {
    spyOn(console, 'log');

    component.onSidebarItemClick('mesas');
    expect(console.log).toHaveBeenCalledWith('Item de sidebar seleccionado:', 'mesas');

    component.onSidebarItemClick('seleccionar');
    expect(console.log).toHaveBeenCalledWith('Item de sidebar seleccionado:', 'seleccionar');
    expect(console.log).toHaveBeenCalledWith('Modo selección activado');

    component.onSidebarItemClick('planta');
    expect(console.log).toHaveBeenCalledWith('Item de sidebar seleccionado:', 'planta');
    expect(console.log).toHaveBeenCalledWith('Cambiando a vista de planta');
  });

  it('should refresh tables', () => {
    spyOn(console, 'log');
    component.refreshTables();
    expect(console.log).toHaveBeenCalledWith('Refrescando estado de las mesas...');
    expect(console.log).toHaveBeenCalledWith('Estado de mesas actualizado');
  });

  it('should render table grid correctly', () => {
    fixture.detectChanges();
    const tableElements = fixture.nativeElement.querySelectorAll('.table-item');
    expect(tableElements.length).toBe(10);
  });

  it('should display table numbers correctly', () => {
    fixture.detectChanges();
    const tableNumbers = fixture.nativeElement.querySelectorAll('.table-number');

    expect(tableNumbers[0].textContent.trim()).toBe('01');
    expect(tableNumbers[1].textContent.trim()).toBe('02');
    expect(tableNumbers[9].textContent.trim()).toBe('10');
  });

  it('should apply correct CSS classes for occupied tables', () => {
    fixture.detectChanges();
    const tableElements = fixture.nativeElement.querySelectorAll('.table-item');

    component.tables.forEach((table, index) => {
      if (table.isOccupied) {
        expect(tableElements[index]).toHaveClass('occupied');
      } else {
        expect(tableElements[index]).toHaveClass('available');
      }
    });
  });

  it('should display logout button', () => {
    fixture.detectChanges();
    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.textContent.trim()).toBe('CERRAR SESIÓN');
  });

  it('should call logout when logout button is clicked', () => {
    spyOn(component, 'logout');
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');
    logoutButton.click();

    expect(component.logout).toHaveBeenCalled();
  });

  it('should display floor buttons', () => {
    fixture.detectChanges();
    const floorButtons = fixture.nativeElement.querySelectorAll('.floor-btn');
    expect(floorButtons.length).toBe(2);
    expect(floorButtons[0].textContent.trim()).toBe('1');
    expect(floorButtons[1].textContent.trim()).toBe('2');
  });

  it('should handle table click events', () => {
    spyOn(component, 'onTableClick');
    fixture.detectChanges();

    const firstTable = fixture.nativeElement.querySelector('.table-item');
    firstTable.click();

    expect(component.onTableClick).toHaveBeenCalledWith(component.tables[0]);
  });
});
