import { UserInterface } from "interfaces/user";

export class User implements UserInterface {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;

  constructor(data: UserInterface) {
    this.id = data.id;
    this.firstName = data.firstName; 
    this.lastName = data.lastName; 
    this.email = data.email;
  }

  static fromDatabase(data: { id: number, first_name: string, last_name: string, email: string }): User {
    return new User({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,   
      email: data.email
    });
  }

  public toJson() : object {
    return {
      id: this.id,
      first_name : this.firstName,
      last_name: this.lastName,
      email : this.email
    }
  }
}