export interface AccessToken {
    token: string;
    config: {
        httpOnly: boolean;
        sameSite: "strict";
        secure: boolean;
        maxAge: number;
    };
}
