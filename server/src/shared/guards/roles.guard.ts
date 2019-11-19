import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { UserRole } from '../../user/models/user-role.enum';
import { User } from '../../user/models/user.model';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly _reflector: Reflector,
                private readonly _userService: UserService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        if (!request.headers || !request.headers.authorization || !request.user) {
            throw new HttpException('Missing header parameters', HttpStatus.BAD_REQUEST);
        }

        const user: InstanceType<User> = request.user;

        const token: string = request.headers.authorization.split(' ')[1];
        if (!this._userService.isAuthorizedUser(user, token)) {
            throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
        }

        const roles = this._reflector.get<UserRole[]>('roles', context.getHandler());

        if (!roles || roles.length === 0) {
            return true;
        }

        const hasRole = () => roles.indexOf(user.role) >= 0;

        if (user && user.role && hasRole()) {
            return true;
        }

        throw new HttpException('You do not have permission (Roles)', HttpStatus.UNAUTHORIZED);
    }
}
