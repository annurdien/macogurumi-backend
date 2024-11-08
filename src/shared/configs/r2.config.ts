import { z } from 'zod';
import { env } from "./env.config";

const r2ConfigSchema = z.object({
    BUCKET_NAME: z.string().min(1),
    ACCESS_KEY_ID: z.string().min(1),
    SECRET_ACCESS_KEY: z.string().min(1),
    ENDPOINT: z.string().url()
});

const validatedConfig = r2ConfigSchema.parse(env.R2)

export const R2_BUCKET_NAME = validatedConfig.BUCKET_NAME;
export const R2_ACCESS_KEY_ID = validatedConfig.ACCESS_KEY_ID;
export const R2_SECRET_ACCESS_KEY = validatedConfig.SECRET_ACCESS_KEY;
export const R2_ENDPOINT = validatedConfig.ENDPOINT;
