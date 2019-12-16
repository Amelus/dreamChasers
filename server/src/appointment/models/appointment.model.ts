import {InstanceType, ModelType, prop} from 'typegoose';
import {BaseModel, schemaOptions} from '../../shared/base.model';
import {Expose} from 'class-transformer';

export class Appointment extends BaseModel<Appointment> {

    @prop({required: [true, 'Title is required']})
    @Expose()
    title: string;

    @prop({required: [true, 'Creator and Content required']})
    @Expose()
    extendedProps: {
        creator: string,
        content: string,
        global: boolean,
    };

    @prop()
    @Expose()
    start: Date;

    @prop()
    @Expose()
    end: Date;

    @prop()
    @Expose()
    allDay: boolean;

    // --- recurring event props ---

    @prop() // eg. [0, 1, 4] -> Sunday, Monday, Thursday
    @Expose()
    daysOfWeek: number[];

    @prop() // eg. '10:45:00'
    @Expose()
    startTime: string;

    @prop()
    @Expose()
    endTime: string;

    @prop()
    @Expose()
    startRecur: Date;

    @prop()
    @Expose()
    endRecur: Date;

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
