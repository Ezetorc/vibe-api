import zod from 'zod';
declare const LikeSchema: zod.ZodObject<{
    id: zod.ZodOptional<zod.ZodNumber>;
    target_id: zod.ZodNumber;
    user_id: zod.ZodNumber;
    type: zod.ZodEnum<["comment", "post"]>;
    created_at: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    type: "post" | "comment";
    user_id: number;
    target_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}, {
    type: "post" | "comment";
    user_id: number;
    target_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}>;
export type Like = zod.infer<typeof LikeSchema>;
export declare function validateLike(object: any): zod.SafeParseReturnType<{
    type: "post" | "comment";
    user_id: number;
    target_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}, {
    type: "post" | "comment";
    user_id: number;
    target_id: number;
    id?: number | undefined;
    created_at?: string | undefined;
}>;
export {};
