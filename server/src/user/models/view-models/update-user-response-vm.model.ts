import {ApiModelPropertyOptional} from '@nestjs/swagger';
import {UserRole} from '../user-role.enum';

export class UpdateUserResponseVm {

    @ApiModelPropertyOptional({example: 'someUrl.com/pic.png'})
    imageUrl?: string;

    @ApiModelPropertyOptional({enum: UserRole})
    role?: UserRole;
}
