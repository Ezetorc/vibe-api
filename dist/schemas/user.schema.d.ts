import zod from 'zod';
declare const UserSchema: zod.ZodObject<{
    id: zod.ZodOptional<zod.ZodNumber>;
    name: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
    image_id: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    image_url: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    description: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    created_at: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    id?: number | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    image_id?: string | null | undefined;
    image_url?: string | null | undefined;
}, {
    name: string;
    email: string;
    password: string;
    id?: number | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    image_id?: string | null | undefined;
    image_url?: string | null | undefined;
}>;
export type User = zod.infer<typeof UserSchema>;
export declare function validatePartialUser(object: unknown): zod.SafeParseReturnType<{
    name?: string | undefined;
    id?: number | undefined;
    email?: string | undefined;
    description?: string | null | undefined;
    password?: string | undefined;
    created_at?: string | undefined;
    image_id?: string | null | undefined;
    image_url?: string | null | undefined;
}, {
    name?: string | undefined;
    id?: number | undefined;
    email?: string | undefined;
    description?: string | null | undefined;
    password?: string | undefined;
    created_at?: string | undefined;
    image_id?: string | null | undefined;
    image_url?: string | null | undefined;
}>;
export {};
