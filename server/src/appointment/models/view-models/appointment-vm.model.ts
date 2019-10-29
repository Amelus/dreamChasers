import {ApiModelProperty} from '@nestjs/swagger';
import {BaseModelVm} from '../../../shared/base.model';
import {Expose} from 'class-transformer';

export class AppointmentVm extends BaseModelVm {

    @ApiModelProperty()
    @Expose()
    creator: string;

    @ApiModelProperty()
    @Expose()
    title: string;

    @ApiModelProperty()
    @Expose()
    content: string;

    @ApiModelProperty()
    @Expose()
    startDate: Date;

    @ApiModelProperty()
    @Expose()
    endDate: Date;
}
