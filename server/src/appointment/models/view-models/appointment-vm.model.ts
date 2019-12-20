import {ApiModelProperty} from '@nestjs/swagger';
import {BaseModelVm} from '../../../shared/base.model';
import {Expose} from 'class-transformer';

export class AppointmentVm extends BaseModelVm {

    @ApiModelProperty()
    @Expose()
    extendedProps: {
        creator: string,
        content: string,
        global: boolean,
    };

    @ApiModelProperty()
    @Expose()
    title: string;

    @ApiModelProperty()
    @Expose()
    start: Date;

    @ApiModelProperty()
    @Expose()
    end: Date;

    @ApiModelProperty()
    @Expose()
    allDay: boolean;

    @ApiModelProperty()
    @Expose()
    backgroundColor: string;

    @ApiModelProperty() // eg. [0, 1, 4] -> Sunday, Monday, Thursday
    @Expose()
    daysOfWeek: number[];

    @ApiModelProperty() // eg. '10:45:00'
    @Expose()
    startTime: string;

    @ApiModelProperty()
    @Expose()
    endTime: string;

    @ApiModelProperty()
    @Expose()
    startRecur: Date;

    @ApiModelProperty()
    @Expose()
    endRecur: Date;

}
