import {z} from 'zod';

export const signInSchema=z.object({
    identifirer:z.string(),
    password:z.string()
})