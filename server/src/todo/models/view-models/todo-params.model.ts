import {ApiModelProperty} from '@nestjs/swagger';
import {TodoStatus} from '../todo-status.enum';

export class TodoParams {

    @ApiModelProperty() creator: string;

    @ApiModelProperty() assignee: string;

    @ApiModelProperty() title: string;

    @ApiModelProperty() content: string;

    @ApiModelProperty() dueDate: Date;

    @ApiModelProperty({enum: TodoStatus, example: TodoStatus.Pending})
    status: TodoStatus;
}
