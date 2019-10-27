import {InstanceType, ModelType, prop} from 'typegoose';
import {BaseModel, schemaOptions} from '../../shared/base.model';
import {AppointmentStatus} from './appointment-status.enum';
import {Expose} from 'class-transformer';

export class Appointment extends BaseModel<Appointment> {

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

    @prop({required: [true, 'Start Date is required']})
    @Expose()
    startDate: Date;

    @prop({required: [true, 'End DAte is required']})
    @Expose()
    endDate: Date;

    @prop({enum: AppointmentStatus, default: AppointmentStatus.Ongoing})
    @Expose()
    status: AppointmentStatus;

    @prop({default: false})
    @Expose()
    isCompleted: boolean;

    static get model(): ModelType<Appointment> {
        return new Appointment().getModelForClass(Appointment, {schemaOptions});
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Appointment> {
        return new this.model();
    }
}
