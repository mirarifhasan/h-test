interface CurrencyInfo {
  name: string;
  symbol: string;
}

export interface Country {
  name: string;
  capital: string[];
  borders: string[];
  population: number;
  region: string;
  subregion: string;
  flags: string;
  currencies: Record<string, CurrencyInfo>;
  languages: Record<string, string>;
}
