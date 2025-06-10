export enum MunicipalIssues {
  Arbolado = 'Arboldado urbano',
  AreasVerdes = 'Alumbrado público',
  Barrido = 'Mantenimiento de cloaca y agua potable',
  ConservacionDeCalles = 'Recolección de residuos',
  Electrotecnia = 'Liempieza de calles',
  EspaciosPublicos = 'Distribución de reigo y agua potable',
  Microbasurales = 'Control urbano y de tránsito',
  ObrasPrivadas = 'Vehículos abandonados',
  ObrasPublicas = 'Conservación de espacios públicos',
  OficinaTecnicaDeObrasSanitarias = 'Atención sanitaria de animales',
  PoliciaMunicipal = 'Control industrial y de plagas',
  ObrasPublicasDuplicado = 'Conservación de espacios públicos', // opcional si querés usar 9 dos veces
}

export const DEPENDENCIES_MAP_IDS: { [key: number]: MunicipalIssues } = {
  1: MunicipalIssues.Arbolado,
  2: MunicipalIssues.AreasVerdes,
  3: MunicipalIssues.Barrido,
  4: MunicipalIssues.ConservacionDeCalles,
  5: MunicipalIssues.Electrotecnia,
  6: MunicipalIssues.EspaciosPublicos,
  7: MunicipalIssues.Microbasurales,
  8: MunicipalIssues.ObrasPrivadas,
  9: MunicipalIssues.ObrasPublicas,
  10: MunicipalIssues.OficinaTecnicaDeObrasSanitarias,
  11: MunicipalIssues.PoliciaMunicipal,
};

export function getDependencyId(value: MunicipalIssues): number | undefined {
  const entry = Object.entries(DEPENDENCIES_MAP_IDS).find(
    ([, enumValue]) => enumValue === value
  );
  return entry ? Number(entry[0]) : undefined; // Devuelve el número o undefined si no lo encuentra
}


export default MunicipalIssues;
