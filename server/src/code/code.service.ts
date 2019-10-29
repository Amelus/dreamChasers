import {Injectable} from '@nestjs/common';
import {BaseService} from '../shared/base.service';
import {Code} from './models/code.model';
import {InjectModel} from '@nestjs/mongoose';
import {ModelType} from 'typegoose';
import {MapperService} from '../shared/mapper/mapper.service';
import {CodeType} from './models/code-type.enum';

@Injectable()
export class CodeService extends BaseService<Code> {
    constructor(
        @InjectModel(Code.modelName) private readonly codeModel: ModelType<Code>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = codeModel;
        this._mapper = _mapperService.mapper;
    }

    async isValidRegistrationCode(code: string): Promise<boolean> {
        const codeModel = await this._model.findOne({pin: code, type: CodeType.Registration});
        if (!codeModel) {
            return false;
        }
        return true;
    }

    async isValidUpgradeCode(code: string): Promise<boolean> {
        const codeModel = await this._model.findOne({pin: code, type: CodeType.Upgrade});
        if (!codeModel) {
            return false;
        }
        return true;
    }
}
