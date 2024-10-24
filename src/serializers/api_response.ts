export interface ResponseSerializer<T> {
  status : number, 
  message : string, 
  data: T
}