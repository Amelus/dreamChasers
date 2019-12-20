import {ApiModelProperty} from '@nestjs/swagger';

export class AppointmentParams {

    @ApiModelProperty()
    title: string;

    @ApiModelProperty()
    content: string;

    @ApiModelProperty()
    global: boolean;

    @ApiModelProperty()
    start: Date;

    @ApiModelProperty()
    end: Date;

    @ApiModelProperty()
    allDay: boolean;

    @ApiModelProperty() // eg. [0, 1, 4] -> Sunday, Monday, Thursday
    daysOfWeek: number[];

    @ApiModelProperty() // eg. '10:45:00'
    startTime: string;

    @ApiModelProperty()
    endTime: string;

    @ApiModelProperty()
    startRecur: Date;

    @ApiModelProperty()
    endRecur: Date;

    @ApiModelProperty()
    backgroundColor: string;
}
