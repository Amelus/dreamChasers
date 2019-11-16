import { ApiModelProperty } from '@nestjs/swagger';
import { UserVm } from './user-vm.model';

export class LoginResponseVm {
    @ApiModelProperty() token: string;

    @ApiModelProperty() expiresIn: string;

    @ApiModelProperty({ type: UserVm })
    user: UserVm;
}
