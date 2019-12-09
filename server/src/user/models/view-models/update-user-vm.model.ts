import {ApiModelPropertyOptional} from '@nestjs/swagger';

export class UpdateUserVm {

    @ApiModelPropertyOptional({example: 'jhonwick23'})
    oldPassword?: string;

    @ApiModelPropertyOptional({example: 'jhonwick23'})
    newPassword?: string;

    @ApiModelPropertyOptional({example: 'jhonwick23'})
    confirmPassword?: string;

    @ApiModelPropertyOptional({example: 'someUrl.com/pic.png'})
    imageUrl?: string;

    @ApiModelPropertyOptional({example: '127346jkda62386'})
    upgradeCode?: string;

}
