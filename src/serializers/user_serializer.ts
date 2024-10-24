import { Request } from 'express'
import { User } from "entities/user";
import { UserService } from "../services/user_service";
import { UserRequest } from 'requests/user_requests';

export interface SerializeUser {
  id : number,
  first_name : string,
  last_name : string,
  email : string
}

export class UserSerializer {
  private userService : UserService;
  private validated_data : object | object[];
  private errors: string[];

  constructor(data: User | User[]) {
    this.validated_data = this.serialize(data);
  }

  private serializeUser(user : User) {
    const serialized : SerializeUser = {
      id : user.id,
      first_name : user.firstName,
      last_name : user.lastName,
      email : user.email,
    }
    return serialized;
  }

  private serialize(data: User | User[]): object | object[] {
    if (Array.isArray(data)) {
      return data.map(user => this.serializeUser(user));
    } else {
      return this.serializeUser(data);
    }
  }

  static validateRequest(request: Request): string[] {
    const requiredFields: (keyof UserRequest)[] = ['first_name', 'last_name', 'email', 'password'];
    const errors: string[] = [];

    const body: any = request.body;
    requiredFields.forEach(field => {
        if (!body[field]) {
            errors.push(`${field.replace('_', ' ')} field is required.`);
        }
    });
    return errors;
  }

  getSerializedData() : object | object[] {
    return this.validated_data;
  }

  async serializeUserId(userId: number) : Promise<UserSerializer> {
    const user : User = await this.userService.getUserById(userId);
    return new UserSerializer(user);
  }
}