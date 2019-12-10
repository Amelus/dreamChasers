import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {UserRole} from '../user-role.enum';
import {UpdateUserStatus} from './update-user-status.enum';

export class UpdateUserResponseVm {

    @ApiModelPropertyOptional({example: 'someUrl.com/pic.png'})
    imageUrl?: string;

    @ApiModelPropertyOptional({enum: UserRole})
    role?: UserRole;

    @ApiModelProperty({enum: UpdateUserStatus})
    status: UpdateUserStatus;
}
