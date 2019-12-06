import {ApiModelPropertyOptional} from '@nestjs/swagger';
import {UserRole} from '../user-role.enum';

export class UpdateUserVm {

    @ApiModelPropertyOptional({example: 'jhonwick23'})
    oldPassword?: string;

    @ApiModelPropertyOptional({example: 'jhonwick23'})
    newPassword?: string;

    @ApiModelPropertyOptional({example: 'jhonwick23'})
    confirmPassword?: string;

    @ApiModelPropertyOptional({example: 'someUrl.com/pic.png'})
    imageUrl?: string;

    @ApiModelPropertyOptional({enum: UserRole})
    role?: UserRole;

}
