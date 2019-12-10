import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {compare, genSalt, hash} from 'bcryptjs';
import {ModelType} from 'typegoose';
import {AuthService} from '../shared/auth/auth.service';
import {JwtPayload} from '../shared/auth/jwt-payload.model';
import {BaseService} from '../shared/base.service';
import {MapperService} from '../shared/mapper/mapper.service';
import {User} from './models/user.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';
import {LoginVm} from './models/view-models/login-vm.model';
import {RegisterVm} from './models/view-models/register-vm.model';
import {UserVm} from './models/view-models/user-vm.model';
import {CodeService} from '../code/code.service';
import {UserRole} from './models/user-role.enum';
import {UpdateUserVm} from './models/view-models/update-user-vm.model';
import {UpdateUserResponseVm} from './models/view-models/update-user-response-vm.model';
import {UpdateUserStatus} from './models/view-models/update-user-status.enum';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
        private readonly _mapperService: MapperService,
        @Inject(forwardRef(() => AuthService))
        readonly _authService: AuthService,
        @Inject(forwardRef(() => CodeService))
        readonly codeService: CodeService,
    ) {
        super();
        this._model = _userModel;
        this._mapper = _mapperService.mapper;
    }

    async register(vm: RegisterVm) {
        const {registrationCode, username, password, firstName, lastName} = vm;

        let leadUser: User;
        let userRole: UserRole = UserRole.User;
        const cCode = await this.codeService.isValidRegistrationCode(registrationCode);
        if (!cCode) {
            try {
                leadUser = await this._userModel.findOne({username: registrationCode, role: UserRole.Leader});
            } catch (e) {
                throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!leadUser) {
                throw new HttpException('Invalid registration code', HttpStatus.BAD_REQUEST);
            }
        } else {
            userRole = UserRole.Leader;
        }

        const newUser = User.createModel();
        newUser.leadUser = leadUser ? leadUser.username : null;
        newUser.username = username.trim().toLowerCase();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.role = userRole;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);

        try {
            const result = await this.create(newUser);
            return result.toJSON() as User;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(vm: LoginVm): Promise<LoginResponseVm> {
        const {username, password} = vm;

        const user = await this.findOne({username});

        if (!user) {
            throw new HttpException('Invalid crendentials', HttpStatus.NOT_FOUND);
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new HttpException('Invalid crendentials', HttpStatus.BAD_REQUEST);
        }

        const payload: JwtPayload = {
            username: user.username,
            role: user.role,
        };

        const token = await this._authService.signPayload(payload);
        const expiresIn: string = '12h';

        console.log(user);

        const userVm: UserVm = await this.map(user.toJSON(), User, UserVm);
        return {
            token,
            expiresIn,
            user: userVm,
        };
    }

    async updateUser(user, vm: UpdateUserVm): Promise<UpdateUserResponseVm> {
        const {oldPassword, newPassword, confirmPassword, imageUrl, upgradeCode} = vm;

        let updated = false;
        if (oldPassword && await compare(oldPassword, user.password) && newPassword === confirmPassword) {
            const salt = await genSalt(10);
            user.password = await hash(newPassword, salt);
            updated = true;
        }

        if (imageUrl) {
            user.imageUrl = imageUrl;
            updated = true;
        }

        if (upgradeCode) {
            const cCode = await this.codeService.isValidUpgradeCode(upgradeCode);
            if (!cCode) {
                console.log('Invalid Upgrade code');
            } else {
                user.role = UserRole.Leader;
                updated = true;
                await this.codeService.removeUsedCode(upgradeCode);
            }
        }

        const response: UpdateUserResponseVm = new UpdateUserResponseVm();

        if (updated) {
            try {
                const updateResult = await this.update(user.id, user);
                response.imageUrl = updateResult.imageUrl;
                response.role = updateResult.role;
                response.status = UpdateUserStatus.Success;
            } catch (e) {
                response.status = UpdateUserStatus.Failed;
            }
        } else {
            response.status = UpdateUserStatus.Needless;
        }

        return response;
    }

    async isAuthorizedUser(user: User, jwtToken: string): Promise<boolean> {
        const jwtUser: JwtPayload = await this._authService.decodeToken(jwtToken);
        return user.username === jwtUser.username;
    }
}
