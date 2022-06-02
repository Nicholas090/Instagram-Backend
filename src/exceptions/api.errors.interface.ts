export default interface IApiError {
  status: number;
  err: any;
  UnauthorizedError: () => IApiError;
  BadRequest: (message: any, err?: any) => IApiError;
}
