import {InstanceType, ModelType, prop} from 'typegoose';
import {BaseModel, schemaOptions} from '../../shared/base.model';
import {Expose} from 'class-transformer';
import {CodeType} from './code-type.enum';

export class Code extends BaseModel<Code> {
    @prop({
        required: [true, 'Code pin is required'],
        unique: true,
        minlength: [6, 'Must be at least 6 characters'],
    })
    @Expose()
    pin: string;

    @prop({
        required: [true, 'Code type is required'],
    })
    @Expose()
    type: CodeType;

    static get model(): ModelType<Code> {
        return new Code().getModelForClass(Code, {schemaOptions});
    }

    static get modelName(): string {
        return this.model.modelName;
    }

    static createModel(): InstanceType<Code> {
        return new this.model();
    }
}
