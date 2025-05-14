import { z } from 'zod';

export const CATEGORY_NAME_VALIDATION = z.string().min(1,{
    message : "Category name is required."
}).regex(/^[a-zA-Z0-9-]+$/,{
    message : "Category name can only contain letters, numbers and hyphens."
})