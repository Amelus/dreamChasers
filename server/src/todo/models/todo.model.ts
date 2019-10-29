import {InstanceType, ModelType, prop} from 'typegoose';
import {BaseModel, schemaOptions} from '../../shared/base.model';
import {TodoStatus} from './todo-status.enum';
import {Expose} from 'class-transformer';

export class Todo extends BaseModel<Todo> {

    @prop({required: [true, 'Creator is required']})
    @Expose()
    creator: string;

    @prop({required: [true, 'Assignee is required']})
    @Expose()
    assignee: string;

    @prop({required: [true, 'Title is required']})
    @Expose()
    title: string;

    @prop({required: [true, 'Content is required']})
    @Expose()
    content: string;

    @prop({required: [true, 'Due startDate is required']})
    @Expose()
    dueDate: Date;

    @prop({enum: TodoStatus, default: TodoStatus.InProgress})
    @Expose()
    status: TodoStatus;

    @prop({default: false})
    @Expose()
    isCompleted: boolean;

    static get model(): ModelType<Todo> {
        return new Todo().getModelForClass(Todo, {schemaOptions});
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Todo> {
        return new this.model();
    }
}
