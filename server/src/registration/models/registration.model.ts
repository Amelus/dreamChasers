import { InstanceType, ModelType, prop } from 'typegoose';
import {BaseModel, schemaOptions} from '../../shared/base.model';
import { Expose } from 'class-transformer';

export class Registration extends BaseModel<Registration> {
    @prop({
        required: [true, 'Registration code is required'],
        unique: true,
        minlength: [6, 'Must be at least 6 characters'],
    })
    @Expose()
    code: string;

    static get model(): ModelType<Registration> {
        return new Registration().getModelForClass(Registration, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Registration> {
        return new this.model();
    }
}
