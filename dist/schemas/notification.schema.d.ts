import zod from 'zod';
declare const NotificationSchema: zod.ZodObject<{
    id: zod.ZodOptional<zod.ZodNumber>;
    sender_id: zod.ZodNumber;
    target_id: zod.ZodNumber;
    type: zod.ZodEnum<["comment", "follow", "like"]>;
    data: zod.ZodOptional<zod.ZodNullable<zod.ZodObject<{
        post_id: zod.ZodOptional<zod.ZodNumber>;
        comment_id: zod.ZodOptional<zod.ZodNumber>;
    }, "strip", zod.ZodTypeAny, {
        post_id?: number | undefined;
        comment_id?: number | undefined;
    }, {
        post_id?: number | undefined;
        comment_id?: number | undefined;
    }>>>;
    created_at: zod.ZodOptional<zod.ZodString>;
    seen: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
}, "strip", zod.ZodTypeAny, {
    type: "follow" | "comment" | "like";
    target_id: number;
    sender_id: number;
    data?: {
        post_id?: number | undefined;
        comment_id?: number | undefined;
    } | null | undefined;
    id?: number | undefined;
    created_at?: string | undefined;
    seen?: boolean | undefined;
}, {
    type: "follow" | "comment" | "like";
    target_id: number;
    sender_id: number;
    data?: {
        post_id?: number | undefined;
        comment_id?: number | undefined;
    } | null | undefined;
    id?: number | undefined;
    created_at?: string | undefined;
    seen?: boolean | undefined;
}>;
export type Notification = zod.infer<typeof NotificationSchema>;
export declare function validateNotification(object: unknown): zod.SafeParseReturnType<{
    type: "follow" | "comment" | "like";
    target_id: number;
    sender_id: number;
    data?: {
        post_id?: number | undefined;
        comment_id?: number | undefined;
    } | null | undefined;
    id?: number | undefined;
    created_at?: string | undefined;
    seen?: boolean | undefined;
}, {
    type: "follow" | "comment" | "like";
    target_id: number;
    sender_id: number;
    data?: {
        post_id?: number | undefined;
        comment_id?: number | undefined;
    } | null | undefined;
    id?: number | undefined;
    created_at?: string | undefined;
    seen?: boolean | undefined;
}>;
export {};
