import {ApiModelProperty} from '@nestjs/swagger';
import {AppointmentStatus} from '../appointment-status.enum';

export class AppointmentParams {

    @ApiModelProperty() creator: string;

    @ApiModelProperty() assignee: string;

    @ApiModelProperty() title: string;

    @ApiModelProperty() content: string;

    @ApiModelProperty() startDate: Date;

    @ApiModelProperty() endDate: Date;

    @ApiModelProperty({enum: AppointmentStatus, example: AppointmentStatus.Ongoing})
    status: AppointmentStatus;
}
