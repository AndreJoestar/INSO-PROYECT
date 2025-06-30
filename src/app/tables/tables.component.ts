import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Table {
  number: number;
  isOccupied: boolean;
  floor: number;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  tables: Table[] = [];
  currentFloor: number = 1;
  selectedTable: Table | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeTables();
  }

  private initializeTables(): void {
    // Inicializar las 10 mesas con estados predeterminados
    this.tables = [
      { number: 1, isOccupied: false, floor: 1 },
      { number: 2, isOccupied: false, floor: 1 },
      { number: 3, isOccupied: true, floor: 1 },   // Mesa ocupada
      { number: 4, isOccupied: false, floor: 1 },
      { number: 5, isOccupied: true, floor: 1 },   // Mesa ocupada
      { number: 6, isOccupied: false, floor: 1 },
      { number: 7, isOccupied: false, floor: 1 },
      { number: 8, isOccupied: false, floor: 1 },
      { number: 9, isOccupied: false, floor: 1 },
      { number: 10, isOccupied: true, floor: 1 }   // Mesa ocupada
    ];
  }

  onTableClick(table: Table): void {
    console.log('Mesa seleccionada:', table.number);
    this.selectedTable = table;

    // Verificar si la mesa está ocupada
    if (table.isOccupied) {
      // Puedes mostrar un mensaje o permitir ver el estado de la mesa ocupada
      console.log('Mesa ocupada - Mostrando estado actual');
      this.navigateToTableDetails(table);
    } else {
      // Mesa disponible - navegar a la interfaz de pedidos
      console.log('Mesa disponible - Iniciando nuevo pedido');
      this.navigateToTableDetails(table);
    }
  }

  private navigateToTableDetails(table: Table): void {
    // Navegar a la interfaz de detalles de la mesa
    // Aquí puedes pasar el número de mesa como parámetro
    console.log(`Navegando a los detalles de la mesa ${table.number}`);

    // Ejemplo de navegación (descomenta cuando tengas la ruta configurada):
    // this.router.navigate(['/table-details', table.number], {
    //   queryParams: {
    //     occupied: table.isOccupied,
    //     floor: table.floor
    //   }
    // });

    // Por ahora, simular la navegación
    alert(`Mesa ${table.number} ${table.isOccupied ? '(Ocupada)' : '(Disponible)'} seleccionada`);
  }

  onFloorChange(floor: number): void {
    this.currentFloor = floor;
    console.log('Cambiando a piso:', floor);

    // Aquí puedes cargar las mesas del piso seleccionado
    // Por ahora mantenemos las mismas mesas para ambos pisos
    // En una implementación real, filtrarías las mesas por piso
  }

  logout(): void {
    console.log('Cerrando sesión...');

    // Limpiar datos de sesión si es necesario
    this.clearSession();

    // Navegar al componente de login
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    // Limpiar datos de sesión almacenados
    // Por ejemplo: localStorage, sessionStorage, etc.
    console.log('Limpiando datos de sesión');

    // Ejemplo:
    // localStorage.removeItem('userToken');
    // sessionStorage.clear();
  }

  // Método para obtener el estado de la mesa
  getTableStatusText(table: Table): string {
    return table.isOccupied ? 'Ocupada' : 'Disponible';
  }

  // Método para obtener el color de estado de la mesa
  getTableStatusColor(table: Table): string {
    return table.isOccupied ? '#ff6b6b' : '#ffffff';
  }

  // Método para verificar si todas las mesas están ocupadas
  areAllTablesOccupied(): boolean {
    return this.tables.every(table => table.isOccupied);
  }

  // Método para obtener el número de mesas disponibles
  getAvailableTablesCount(): number {
    return this.tables.filter(table => !table.isOccupied).length;
  }

  // Método para obtener el número de mesas ocupadas
  getOccupiedTablesCount(): number {
    return this.tables.filter(table => table.isOccupied).length;
  }

  // Método para refrescar el estado de las mesas
  refreshTables(): void {
    console.log('Refrescando estado de las mesas...');

    // Aquí llamarías a un servicio para obtener el estado actualizado
    // Por ejemplo:
    // this.tableService.getTables().subscribe(tables => {
    //   this.tables = tables;
    // });

    // Por ahora, simular la actualización
    console.log('Estado de mesas actualizado');
  }

  // Método para manejar el cambio de vista en la sidebar
  onSidebarItemClick(item: string): void {
    console.log('Item de sidebar seleccionado:', item);

    switch (item) {
      case 'mesas':
        // Ya estamos en la vista de mesas
        break;
      case 'seleccionar':
        // Cambiar a modo de selección
        console.log('Modo selección activado');
        break;
      case 'planta':
        // Cambiar a vista de planta
        console.log('Cambiando a vista de planta');
        break;
    }
  }
}
