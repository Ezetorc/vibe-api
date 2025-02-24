import zod from 'zod';
export declare const UserSchema: zod.ZodObject<{
    id: zod.ZodOptional<zod.ZodNumber>;
    name: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
    profile_image_id: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    description: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    created_at: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    id?: number | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    profile_image_id?: string | null | undefined;
}, {
    name: string;
    email: string;
    password: string;
    id?: number | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    profile_image_id?: string | null | undefined;
}>;
export type User = zod.infer<typeof UserSchema>;
export declare function validateUser(object: any): zod.SafeParseReturnType<{
    name: string;
    email: string;
    password: string;
    id?: number | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    profile_image_id?: string | null | undefined;
}, {
    name: string;
    email: string;
    password: string;
    id?: number | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    profile_image_id?: string | null | undefined;
}>;
export declare function validatePartialUser(object: any): zod.SafeParseReturnType<{
    name?: string | undefined;
    id?: number | undefined;
    email?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    password?: string | undefined;
    profile_image_id?: string | null | undefined;
}, {
    name?: string | undefined;
    id?: number | undefined;
    email?: string | undefined;
    description?: string | null | undefined;
    created_at?: string | undefined;
    password?: string | undefined;
    profile_image_id?: string | null | undefined;
}>;
