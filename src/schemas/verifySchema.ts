import {z} from 'zod';

export const verifySchema=z.object({
    code:z.string().length(6,'code has to be 6 characters in length')
})