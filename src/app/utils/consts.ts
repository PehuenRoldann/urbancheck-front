export const Priorities = new Map([
  [1, 'Muy Alta'],
  [2, 'Alta'],
  [3, 'Media'],
  [4, 'Baja'],
]);

export const Statuses = new Map([
  [1, 'Pendiente'],
  [2, 'Válido'],
  [3, 'Programada'],
  [4, 'Resuelto'],
  [5, 'Finalizado'],
  [6, 'Cuestionada'],
  [7, 'Rechazado'],
  [8, 'Derivado'],
  [9, 'Cancelado'],
]);

export const RolesMap = new Map([
  [1, 'Operador Att. al vecino'],
  [2, 'Ciudadano'],
  [3, 'Responsable de dependencia'],
  [4, 'Miembro de cuadrilla'],
]);

export const DependenciesMap = new Map<number, string>([
  [1, 'Arbolado urbano'],
  [2, 'Alumbrado público'],
  [3, 'Mantenimiento de cloaca y agua potable'],
  [4, 'Recolección de residuos'],
  [5, 'Limpieza de calles'],
  [6, 'Distribución de riego y agua potable'],
  [7, 'Control urbano y de tránsito'],
  [8, 'Vehículos abandonados'],
  [9, 'Conservación de espacios públicos'],
  [10, 'Atención sanitaria de animales'],
  [11, 'Control industrial y de plagas'],
]);
