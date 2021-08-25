export interface IGroup {
  _id: string;
  name: string;
  teacher: string;
  students?: IStudent[];
}

export interface IStudent {
  name: string;
  age: number;
  sex: "Male" | "Female";
  email: string;
  bornDate: number;
  city: string;
  group: string | IGroup;
}