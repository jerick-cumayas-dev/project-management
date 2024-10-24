import { Request, Response } from 'express'
import { UserService } from '../services/user_service'
import { User } from '../entities/user'
import { ResponseSerializer } from '../serializers/api_response';
import { UserSerializer } from '../serializers/user_serializer';

export class UserController {
  private userService : UserService;

  public getAllUsers = async (request: Request, response: Response): Promise<void> => {
    try {
      const users: User[] = await this.userService.getUsers();
      const serializer : UserSerializer = new UserSerializer(users);
      response.json({"status": 200, "message" : "success", "data" : serializer.getSerializedData()});
    } catch (error) {
      console.error('Error fetching users:', error);
      response.status(500).json({ message: 'Internal Server Error' }); // Handle errors gracefully
    }
  };
  
  public getUser = async (request: Request, response: Response) => {
    const id : number = parseInt(request.params.id)
  
    try {
      const user : User = await this.userService.getUserById(id)
      const serializer : UserSerializer = new UserSerializer(user)
      const successResponse : ResponseSerializer <object> = {
        status : 200,
        message : "success",
        data : serializer.getSerializedData()
      }
      response.status(200).json(successResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      const errorResponse : ResponseSerializer <null> = {
        status : errorMessage === "User not found." ? 404 : 500,
        message : errorMessage,
        data : null
      }
      response.status(errorResponse.status).json(errorResponse)
    }
  }
  
  public createUser = async (request: Request, response: Response): Promise<void> => {
    try {
        const serializerErrors = UserSerializer.validateRequest(request);
  
        if (serializerErrors.length > 0) {
            // Return early after sending the response
             response.status(400).json({
                status: 400,
                message: 'Validation Error',
                errors: serializerErrors,
                data: null
            });
        }
        const newUser = await this.userService.create(request.body);
  
        const successResponse : ResponseSerializer <User> = {
          status : 201,
          message : "success",
          data : newUser
        }
        response.status(successResponse.status).json(successResponse);
  
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        const errorResponse: ResponseSerializer<null> = {
            status: errorMessage === "User not found." ? 404 : 500,
            message: errorMessage,
            data: null
        }
         response.status(errorResponse.status).json(errorResponse);
    }
  };
  
  public updateUser = async (request: Request, response: Response) => {
    try{
      const userId = parseInt(request.params.id);
      console.log(userId)
      const serializerErrors = UserSerializer.validateRequest(request);
  
        if (serializerErrors.length > 0) {
             response.status(400).json({
                status: 400,
                message: 'Validation Error',
                errors: serializerErrors,
                data: null
            });
        }
        const newUser = await this.userService.update(userId, request.body);
        const successResponse : ResponseSerializer <User> = {
          status : 200,
          message : "success",
          data : newUser
        }
        response.status(successResponse.status).json(successResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        const errorResponse: ResponseSerializer<null> = {
            status: errorMessage === "User not found." ? 404 : 500,
            message: errorMessage,
            data: null
        }
        // Return the error response
         response.status(errorResponse.status).json(errorResponse);
    }
  }
}



