import {Body, Controller, Get, HttpException, HttpStatus, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {ApiException} from '../shared/api-exception.model';
import {GetOperationId} from '../shared/utilities/get-operation-id.helper';
import {User} from './models/user.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';
import {LoginVm} from './models/view-models/login-vm.model';
import {RegisterVm} from './models/view-models/register-vm.model';
import {UserVm} from './models/view-models/user-vm.model';
import {UserService} from './user.service';
import {Roles} from '../shared/decorators/roles.decorator';
import {UserRole} from './models/user-role.enum';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../shared/guards/roles.guard';
import {InstanceType} from 'typegoose';
import {map} from 'lodash';
import {UpdateUserVm} from './models/view-models/update-user-vm.model';
import {UpdateUserResponseVm} from './models/view-models/update-user-response-vm.model';

@Controller('user')
@ApiUseTags(User.modelName)
export class UserController {
    constructor(private readonly _userService: UserService) {
    }

    @Get()
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({type: UpdateUserResponseVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'Update'))
    async get(@Req() request): Promise<UserVm> {

        const user: InstanceType<User> = request.user;
        const username = user.username;
        let exist: InstanceType<User>;
        try {
            exist = await this._userService.findOne({username});
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!exist) {
            throw new HttpException(`${username} does not exist`, HttpStatus.BAD_REQUEST);
        }

        return exist;
    }

    @Post('register')
    @ApiCreatedResponse({type: UserVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'Register'))
    async register(@Body() vm: RegisterVm): Promise<UserVm> {
        const {registrationCode, username, password, firstName, lastName} = vm;

        if (!registrationCode) {
            throw new HttpException('Registration code is required', HttpStatus.BAD_REQUEST);
        }

        if (!username) {
            throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
        }

        if (!password) {
            throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
        }

        if (!firstName || !lastName) {
            throw new HttpException('Full name is required', HttpStatus.BAD_REQUEST);
        }

        let exist;
        try {
            exist = await this._userService.findOne({username});
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (exist) {
            throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
        }

        const newUser = await this._userService.register(vm);
        console.log(newUser);
        return this._userService.map(newUser, User, UserVm);
    }

    @Post('login')
    @ApiCreatedResponse({type: LoginResponseVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'Login'))
    async login(@Body() vm: LoginVm): Promise<LoginResponseVm> {
        const fields = Object.keys(vm);
        fields.forEach(field => {
            if (!vm[field]) {
                throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
            }
        });

        return this._userService.login(vm);
    }

    @Put('update')
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({type: UpdateUserResponseVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'Update'))
    async update(@Req() request, @Body() vm: UpdateUserVm): Promise<UpdateUserResponseVm> {
        const {oldPassword, newPassword, confirmPassword, imageUrl, upgradeCode} = vm;

        if (oldPassword) {
            if (newPassword) {
                if (!confirmPassword || (confirmPassword !== newPassword)) {
                    throw new HttpException('Confirmation password is invalid', HttpStatus.BAD_REQUEST);
                }
            }
        } else {
            if (newPassword || confirmPassword) {
                throw new HttpException('Old password is required', HttpStatus.BAD_REQUEST);
            }
        }

        const user: InstanceType<User> = request.user;
        const username = user.username;
        let exist: InstanceType<User>;
        try {
            exist = await this._userService.findOne({username});
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!exist) {
            throw new HttpException(`${username} does not exist`, HttpStatus.BAD_REQUEST);
        }

        return  await this._userService.updateUser(exist, vm);
    }

    @Get('assignees')
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: UserVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'GetAssignees'))
    async getAllAssigneesOfLeader(@Req() request): Promise<UserVm[]> {

        const leadUser: InstanceType<User> = request.user;
        const filter = {};
        filter['leadUser'] = leadUser.username;

        try {
            const users: InstanceType<User>[] = await this._userService.findAll(filter);
            return this._userService.mapArray(map(users, user => user.toJSON()), User, UserVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
