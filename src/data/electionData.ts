export interface CityData {
  id: number;
  cidade: string;
  eleitores: number;
  votos2018: number | null;
  votos2022: number | null;
  metaMax: number | null;
  metaMed: number | null;
  metaMin: number | null;
}
