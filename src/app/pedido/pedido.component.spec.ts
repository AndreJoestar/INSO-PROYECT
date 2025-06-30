import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PedidoComponent } from './pedido.component';

describe('PedidoComponent', () => {
  let component: PedidoComponent;
  let fixture: ComponentFixture<PedidoComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Mock del Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock del ActivatedRoute
    mockActivatedRoute = {
      params: of({ mesa: '01' })
    };

    await TestBed.configureTestingModule({
      declarations: [PedidoComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Limpiar localStorage después de cada test
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.mesaSeleccionada).toBe('01');
    expect(component.capacidadMesa).toBe(4);
    expect(component.pisoMesa).toBe(1);
    expect(component.pedidoItems).toEqual([]);
    expect(component.comentarios).toBe('');
    expect(component.mostrarModalProductos).toBeFalse();
  });

  it('should load mesa data from route params', () => {
    mockActivatedRoute.params = of({ mesa: '05' });
    component.ngOnInit();

    expect(component.mesaSeleccionada).toBe('05');
    expect(component.capacidadMesa).toBe(8);
    expect(component.pisoMesa).toBe(1);
  });

  it('should have predefined products', () => {
    expect(component.productosDisponibles.length).toBeGreaterThan(0);
    expect(component.productosDisponibles).toContain(
      jasmine.objectContaining({ nombre: 'Inca Cola' })
    );
    expect(component.productosDisponibles).toContain(
      jasmine.objectContaining({ nombre: 'Lomo Saltado' })
    );
    expect(component.productosDisponibles).toContain(
      jasmine.objectContaining({ nombre: 'Ají de Gallina' })
    );
  });

  it('should show and hide product modal', () => {
    expect(component.mostrarModalProductos).toBeFalse();

    component.mostrarProductos();
    expect(component.mostrarModalProductos).toBeTrue();

    component.cerrarModalProductos();
    expect(component.mostrarModalProductos).toBeFalse();
  });

  it('should add product to pedido', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };

    component.agregarProducto(producto);

    expect(component.pedidoItems.length).toBe(1);
    expect(component.pedidoItems[0]).toEqual({
      id: 1,
      nombre: 'Inca Cola',
      precio: 8.00,
      cantidad: 1
    });
    expect(component.mostrarModalProductos).toBeFalse();
  });

  it('should increment quantity when adding existing product', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };

    component.agregarProducto(producto);
    component.agregarProducto(producto);

    expect(component.pedidoItems.length).toBe(1);
    expect(component.pedidoItems[0].cantidad).toBe(2);
  });

  it('should remove item from pedido', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };
    component.agregarProducto(producto);

    expect(component.pedidoItems.length).toBe(1);

    component.removerItem(0);

    expect(component.pedidoItems.length).toBe(0);
  });

  it('should calculate total correctly', () => {
    const producto1 = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };
    const producto2 = { id: 2, nombre: 'Lomo Saltado', precio: 25.00, categoria: 'platos' };

    component.agregarProducto(producto1);
    component.agregarProducto(producto1); // cantidad: 2
    component.agregarProducto(producto2); // cantidad: 1

    const total = component.calcularTotal();
    expect(total).toBe(41.00); // (8 * 2) + (25 * 1) = 41
  });

  it('should clear pedido', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };
    component.agregarProducto(producto);
    component.comentarios = 'Test comment';

    component.limpiarPedido();

    expect(component.pedidoItems.length).toBe(0);
    expect(component.comentarios).toBe('');
  });

  it('should not register empty pedido', () => {
    spyOn(window, 'alert');

    component.registrarPedido();

    expect(window.alert).toHaveBeenCalledWith('Debe agregar al menos un producto al pedido');
  });

  it('should register pedido with items', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };
    component.agregarProducto(producto);
    component.comentarios = 'Sin hielo';

    spyOn(window, 'alert');
    spyOn(component as any, 'enviarPedidoAlServidor');

    component.registrarPedido();

    expect(component['enviarPedidoAlServidor']).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      jasmine.stringContaining('Pedido registrado exitosamente')
    );
    expect(component.pedidoItems.length).toBe(0);
    expect(component.comentarios).toBe('');
  });

  it('should navigate back to mesa selection', () => {
    component.volverASeleccionarMesa();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/mesas']);
  });

  it('should save pedido to localStorage when adding products', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };

    component.agregarProducto(producto);

    const savedData = localStorage.getItem('pedido_mesa_01');
    expect(savedData).toBeTruthy();

    const parsedData = JSON.parse(savedData!);
    expect(parsedData.items.length).toBe(1);
    expect(parsedData.items[0].nombre).toBe('Inca Cola');
  });

  it('should load existing pedido from localStorage', () => {
    const pedidoData = {
      items: [
        { id: 1, nombre: 'Inca Cola', precio: 8.00, cantidad: 2 }
      ],
      comentarios: 'Test comment'
    };

    localStorage.setItem('pedido_mesa_01', JSON.stringify(pedidoData));

    component.cargarPedidoExistente();

    expect(component.pedidoItems.length).toBe(1);
    expect(component.pedidoItems[0].nombre).toBe('Inca Cola');
    expect(component.pedidoItems[0].cantidad).toBe(2);
    expect(component.comentarios).toBe('Test comment');
  });

  it('should handle mesa data correctly', () => {
    component.obtenerDatosMesa('05');

    expect(component.capacidadMesa).toBe(8);
    expect(component.pisoMesa).toBe(1);
  });

  it('should handle unknown mesa number', () => {
    const originalCapacidad = component.capacidadMesa;
    const originalPiso = component.pisoMesa;

    component.obtenerDatosMesa('99');

    // Should keep original values if mesa not found
    expect(component.capacidadMesa).toBe(originalCapacidad);
    expect(component.pisoMesa).toBe(originalPiso);
  });

  it('should close session with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.cerrarSesion();

    expect(window.confirm).toHaveBeenCalledWith('¿Está seguro que desea cerrar sesión?');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not close session without confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.cerrarSesion();

    expect(window.confirm).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/login']);
  });

  it('should ask for confirmation when leaving with pending order', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };
    component.agregarProducto(producto);

    spyOn(window, 'confirm').and.returnValue(true);

    component.volverASeleccionarMesa();

    expect(window.confirm).toHaveBeenCalledWith(
      'Hay un pedido en progreso. ¿Desea guardarlo temporalmente?'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/mesas']);
  });

  it('should clear pedido when not confirmed to save', () => {
    const producto = { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' };
    component.agregarProducto(producto);

    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component, 'limpiarPedido');

    component.volverASeleccionarMesa();

    expect(component.limpiarPedido).toHaveBeenCalled();
  });
});
