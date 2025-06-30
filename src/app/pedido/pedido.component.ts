import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormsModule} from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

interface PedidoItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Mesa {
  numero: string;
  capacidad: number;
  piso: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  // Datos de la mesa seleccionada
  mesaSeleccionada: string = '01';
  capacidadMesa: number = 4;
  pisoMesa: number = 1;

  // Estado del pedido
  pedidoItems: PedidoItem[] = [];
  comentarios: string = '';

  // Modal de productos
  mostrarModalProductos: boolean = false;

  // Productos disponibles
  productosDisponibles: Producto[] = [
    { id: 1, nombre: 'Inca Cola', precio: 8.00, categoria: 'bebidas' },
    { id: 2, nombre: 'Lomo Saltado', precio: 25.00, categoria: 'platos' },
    { id: 3, nombre: 'Ají de Gallina', precio: 22.00, categoria: 'platos' },
    { id: 4, nombre: 'Papas a la Huancaína', precio: 15.00, categoria: 'entradas' },
    { id: 5, nombre: 'Coca Cola', precio: 7.00, categoria: 'bebidas' },
    { id: 6, nombre: 'Chicha Morada', precio: 6.00, categoria: 'bebidas' },
    { id: 7, nombre: 'Arroz Chaufa', precio: 20.00, categoria: 'platos' },
    { id: 8, nombre: 'Ceviche', precio: 28.00, categoria: 'platos' },
    { id: 9, nombre: 'Causa Limeña', precio: 18.00, categoria: 'entradas' },
    { id: 10, nombre: 'Pisco Sour', precio: 15.00, categoria: 'bebidas' },
    { id: 11, nombre: 'Anticuchos', precio: 12.00, categoria: 'entradas' },
    { id: 12, nombre: 'Pollo a la Brasa', precio: 35.00, categoria: 'platos' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener datos de la mesa desde los parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['mesa']) {
        this.mesaSeleccionada = params['mesa'];
        this.obtenerDatosMesa(params['mesa']);
      }
    });

    // Cargar pedido existente si hay uno
    this.cargarPedidoExistente();
  }

  /**
   * Obtiene los datos de la mesa seleccionada
   */
  obtenerDatosMesa(numeroMesa: string): void {
    // Simulación de datos de mesa - en una app real vendría de un servicio
    const mesas: { [key: string]: Mesa } = {
      '01': { numero: '01', capacidad: 4, piso: 1, estado: 'disponible' },
      '02': { numero: '02', capacidad: 6, piso: 1, estado: 'disponible' },
      '03': { numero: '03', capacidad: 2, piso: 1, estado: 'ocupada' },
      '04': { numero: '04', capacidad: 4, piso: 1, estado: 'disponible' },
      '05': { numero: '05', capacidad: 8, piso: 1, estado: 'ocupada' },
      '06': { numero: '06', capacidad: 4, piso: 1, estado: 'disponible' },
      '07': { numero: '07', capacidad: 4, piso: 2, estado: 'disponible' },
      '08': { numero: '08', capacidad: 6, piso: 2, estado: 'disponible' },
      '09': { numero: '09', capacidad: 2, piso: 2, estado: 'disponible' },
      '10': { numero: '10', capacidad: 10, piso: 2, estado: 'ocupada' }
    };

    const mesa = mesas[numeroMesa];
    if (mesa) {
      this.capacidadMesa = mesa.capacidad;
      this.pisoMesa = mesa.piso;
    }
  }

  /**
   * Carga un pedido existente de la mesa (simulado)
   */
  cargarPedidoExistente(): void {
    // En una aplicación real, aquí se consultaría la base de datos
    // para ver si ya existe un pedido para esta mesa
    const pedidoGuardado = localStorage.getItem(`pedido_mesa_${this.mesaSeleccionada}`);
    if (pedidoGuardado) {
      const datos = JSON.parse(pedidoGuardado);
      this.pedidoItems = datos.items || [];
      this.comentarios = datos.comentarios || '';
    }
  }

  /**
   * Muestra el modal de selección de productos
   */
  mostrarProductos(): void {
    this.mostrarModalProductos = true;
  }

  /**
   * Cierra el modal de productos
   */
  cerrarModalProductos(): void {
    this.mostrarModalProductos = false;
  }

  /**
   * Agrega un producto al pedido
   */
  agregarProducto(producto: Producto): void {
    const itemExistente = this.pedidoItems.find(item => item.id === producto.id);

    if (itemExistente) {
      // Si el producto ya existe, incrementar la cantidad
      itemExistente.cantidad++;
    } else {
      // Si es nuevo, agregarlo con cantidad 1
      this.pedidoItems.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }

    // Guardar automáticamente
    this.guardarPedidoTemporal();

    // Cerrar modal después de agregar
    this.cerrarModalProductos();
  }

  /**
   * Remueve un item del pedido
   */
  removerItem(index: number): void {
    this.pedidoItems.splice(index, 1);
    this.guardarPedidoTemporal();
  }

  /**
   * Calcula el total del pedido
   */
  calcularTotal(): number {
    return this.pedidoItems.reduce((total, item) => {
      return total + (item.precio * item.cantidad);
    }, 0);
  }

  /**
   * Registra el pedido
   */
  registrarPedido(): void {
    if (this.pedidoItems.length === 0) {
      alert('Debe agregar al menos un producto al pedido');
      return;
    }

    const pedido = {
      mesa: this.mesaSeleccionada,
      items: this.pedidoItems,
      comentarios: this.comentarios,
      total: this.calcularTotal(),
      fecha: new Date(),
      estado: 'pendiente'
    };

    // Simular guardado en base de datos
    console.log('Pedido registrado:', pedido);

    // En una aplicación real, aquí se enviaría al backend
    this.enviarPedidoAlServidor(pedido);

    // Limpiar pedido temporal
    localStorage.removeItem(`pedido_mesa_${this.mesaSeleccionada}`);

    // Mostrar confirmación
    alert(`Pedido registrado exitosamente para la Mesa ${this.mesaSeleccionada}. Total: S/. ${this.calcularTotal().toFixed(2)}`);

    // Limpiar formulario
    this.limpiarPedido();
  }

  /**
   * Limpia el pedido actual
   */
  limpiarPedido(): void {
    this.pedidoItems = [];
    this.comentarios = '';
    localStorage.removeItem(`pedido_mesa_${this.mesaSeleccionada}`);
  }

  /**
   * Guarda el pedido temporalmente
   */
  private guardarPedidoTemporal(): void {
    const datos = {
      items: this.pedidoItems,
      comentarios: this.comentarios
    };
    localStorage.setItem(`pedido_mesa_${this.mesaSeleccionada}`, JSON.stringify(datos));
  }

  /**
   * Simula el envío del pedido al servidor
   */
  private enviarPedidoAlServidor(pedido: any): void {
    // Aquí iría la lógica para enviar al backend
    // Por ejemplo: this.pedidoService.crearPedido(pedido)
    console.log('Enviando pedido al servidor...', pedido);
  }

  /**
   * Vuelve a la selección de mesas
   */
  volverASeleccionarMesa(): void {
    // Guardar pedido temporal antes de salir
    if (this.pedidoItems.length > 0 || this.comentarios.trim()) {
      this.guardarPedidoTemporal();
      const confirmar = confirm('Hay un pedido en progreso. ¿Desea guardarlo temporalmente?');
      if (!confirmar) {
        this.limpiarPedido();
      }
    }

    this.router.navigate(['/mesas']);
  }

  /**
   * Método para cerrar sesión
   */
  cerrarSesion(): void {
    // Lógica para cerrar sesión
    const confirmar = confirm('¿Está seguro que desea cerrar sesión?');
    if (confirmar) {
      this.router.navigate(['/login']);
    }
  }
}
