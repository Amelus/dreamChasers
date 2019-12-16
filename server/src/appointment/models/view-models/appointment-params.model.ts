import {ApiModelProperty} from '@nestjs/swagger';

export class AppointmentParams {

    @ApiModelProperty()
    extendedProps: {
        creator: string,
        content: string,
        global: boolean,
    };

    @ApiModelProperty()
    title: string;

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
}
