import zod from 'zod';
declare const PostSchema: zod.ZodObject<{
    id: zod.ZodOptional<zod.ZodNumber>;
    user_id: zod.ZodNumber;
    content: zod.ZodString;
    created_at: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    content: string;
    user_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}, {
    content: string;
    user_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}>;
export type Post = zod.infer<typeof PostSchema>;
export declare function validatePost(object: unknown): zod.SafeParseReturnType<{
    content: string;
    user_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}, {
    content: string;
    user_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}>;
export declare function validatePartialPost(object: unknown): zod.SafeParseReturnType<{
    id?: number | undefined;
    content?: string | undefined;
    user_id?: number | undefined;
    created_at?: string | undefined;
}, {
    id?: number | undefined;
    content?: string | undefined;
    user_id?: number | undefined;
    created_at?: string | undefined;
}>;
export {};
