import type { UserResponse } from "./User"

export interface RequestOtp{
    email : string 
}

export interface VerifyOtp{
    email : string
    code : string 
    verifcation_token : string
}

export interface RefreshToken{
    refresh_token : string
}


export interface LoginResponse {
    access_token : string 
    refresh_token : string 
    user : UserResponse 
    token_type : string
}