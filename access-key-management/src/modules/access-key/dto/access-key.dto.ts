export class CreateAccessKeyDto {
    username: string;
    rateLimit: number;
    expiration: Date;
}
export class UpdateAccessKeyDto {
    rateLimit?: number;
    expiration?: Date;
}