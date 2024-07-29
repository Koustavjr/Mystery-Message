import {z} from 'zod';

const usernameValidate=z.string().min(2,'user name must be 2 characters ')
                                 .max(10,'username can be atmost 6 characters')
                                 .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');
                                         
                                 
export const signUpSchema=z.object({
    username:usernameValidate,
    email:z.string().email({message:"Enter valid email"}),
    password:z.string().min(6,{message:"password must be 6 characters long"})
});    
