export interface IResponse<T>{
   success: boolean,
   message: string,
   result: T
}

export interface LoginResponse{
    accessToken: string,
    refreshToken: string
}