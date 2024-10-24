import { connection } from "./mysql_service";
import { User } from "../entities/user";
import { QueryError, QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { UserSerializer } from "../serializers/user_serializer";
import { UserRequest } from "requests/user_requests";

export class UserService {
  private table : string = "users";

  public getUsers = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${this.table}`, (error : QueryError, results : RowDataPacket[]) => {
        if (error) {
          console.error('Error fetching users:', error);
          return reject(error); 
        }
        const users : User[] = results.map((result : any) => User.fromDatabase(result));
        resolve(users as User[]);
      });
    });
  };
  
  public getUserById = (id: number): Promise<User> => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id], (error: QueryError, results: RowDataPacket[]) => {
        if (error) {
          console.error('Error fetching user by id:', error);
          return reject(error);
        }
  
        if (results.length > 0) {
          const user = User.fromDatabase(results[0] as any); // Convert to User instance
          resolve(user);
        } else {
          reject(new Error("User not found."));
        }
      });
    });
  };
  
  
  public create = (data : UserRequest) : Promise<User> => {
    return new Promise((resolve, reject) => {
      const sql_query : string = `INSERT INTO ${this.table} (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
  
      connection.query<ResultSetHeader>(sql_query, [data.first_name, data.last_name, data.email, data.password], (error, results) => {
        if (error) {
          console.error('Error creating user.', error);
          return reject(error);
        }
        const newUser: User = new User ({
          id: results.insertId,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
        });
        resolve(newUser);
      })
    })
  }
  
  public update = (id: number, data: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentUser: User = await this.getUserById(id);
        const userData: UserRequest = new UserSerializer(currentUser).getSerializedData() as UserRequest; 
  
        const updateFields: string[] = [];
        const values: string[] = [];
  
        (["first_name", "last_name", "email", "password"] as (keyof UserRequest)[]).forEach((field) => {
          if (data[field] && data[field] !== userData[field]) {
            updateFields.push(`${String(field)} = ?`);
            values.push(data[field]);
          }
        });
  
        if (!updateFields.length) return resolve("No fields to update.");
        
        const sql_query = `UPDATE ${this.table} SET ${updateFields.join(', ')} WHERE id = ?`;
        connection.query<ResultSetHeader>(sql_query, [...values, id], (error, results) => {
          if (error) {
            console.error('Error updating user.', error);
            return reject(error);
          }
          resolve(new User ({
            id: id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
          }));
        });
        
      } catch (error) {
        reject(error);
      }
    });
  };

}



