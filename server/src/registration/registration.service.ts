import {forwardRef, HttpException, Inject, Injectable} from '@nestjs/common';
import {BaseService} from '../shared/base.service';
import {Registration} from './models/registration.model';
import {InjectModel} from '@nestjs/mongoose';
import {ModelType} from 'typegoose';
import {MapperService} from '../shared/mapper/mapper.service';
import {UserService} from '../user/user.service';

@Injectable()
export class RegistrationService extends BaseService<Registration> {
    constructor(
        @InjectModel(Registration.modelName) private readonly _registrationModel: ModelType<Registration>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _registrationModel;
        this._mapper = _mapperService.mapper;
    }

    async isValidRegistrationCode(code: string): Promise<boolean> {
        const registrationModel = await this._model.findOne({ code });
        if (!registrationModel) {
            return false;
        }
        return true;
    }
}
