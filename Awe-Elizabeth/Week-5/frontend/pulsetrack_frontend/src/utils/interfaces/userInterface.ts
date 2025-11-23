export interface IUser{
    email: string,
    firstName: string,
    lastName: string,
    about: string,
    isLocked: string
}

export interface RegisterRequest{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

