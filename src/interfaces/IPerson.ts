export interface IPerson {
  surName: string;
  firstName: string;
  patronymic: string;
  car: ICar[];
  id: number
}

export interface ICar {
  id: number;
  number: string;
  brand: string;
  model: string;
  year: number;
}

