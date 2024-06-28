import { Controller, Get, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Get('info')
    async getTokenInfo(@Headers('x-access-key') key: string): Promise<any> {
        if (!key) {
            throw new HttpException('Access key is required', HttpStatus.BAD_REQUEST);
        }

        return await this.tokenService.getTokenInfo(key);
    }
}
