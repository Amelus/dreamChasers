import { ApiModelProperty } from '@nestjs/swagger';
import { BaseModelVm } from '../../../shared/base.model';
import { TodoStatus } from '../todo-status.enum';
import { Expose } from 'class-transformer';

export class TodoVm extends BaseModelVm {

    @ApiModelProperty()
    @Expose()
    creator: string;

    @ApiModelProperty()
    @Expose()
    assignee: string;

    @ApiModelProperty()
    @Expose()
    title: string;

    @ApiModelProperty()
    @Expose()
    content: string;

    @ApiModelProperty()
    @Expose()
    dueDate: Date;

    @ApiModelProperty({ enum: TodoStatus })
    @Expose()
    status: TodoStatus;

    @ApiModelProperty()
    @Expose()
    isCompleted: boolean;
}
