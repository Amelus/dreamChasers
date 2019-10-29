import {ApiModelProperty} from '@nestjs/swagger';

export class AppointmentParams {

    @ApiModelProperty() creator: string;

    @ApiModelProperty() title: string;

    @ApiModelProperty() content: string;

    @ApiModelProperty() startDate: Date;

    @ApiModelProperty() endDate: Date;
}
