export class CreateAccessKeyDto {
    username: string;
    rateLimit: number;
    expiration: Date;
    tokens: number;
}
export class UpdateAccessKeyDto {
    rateLimit?: number;
    expiration?: Date;
    tokens?: number;
}