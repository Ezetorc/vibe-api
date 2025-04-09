import zod from 'zod';
declare const CommentSchema: zod.ZodObject<{
    id: zod.ZodOptional<zod.ZodNumber>;
    user_id: zod.ZodNumber;
    post_id: zod.ZodNumber;
    content: zod.ZodString;
    created_at: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    content: string;
    user_id: number;
    post_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}, {
    content: string;
    user_id: number;
    post_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}>;
export type Comment = zod.infer<typeof CommentSchema>;
export declare function validatePartialComment(object: unknown): zod.SafeParseReturnType<{
    id?: number | undefined;
    content?: string | undefined;
    user_id?: number | undefined;
    post_id?: number | undefined;
    created_at?: string | undefined;
}, {
    id?: number | undefined;
    content?: string | undefined;
    user_id?: number | undefined;
    post_id?: number | undefined;
    created_at?: string | undefined;
}>;
export {};
