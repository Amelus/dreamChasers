import {HttpException, Injectable} from '@nestjs/common';
import {BaseService} from '../shared/base.service';
import {Registration} from './models/registration.model';
import {InjectModel} from '@nestjs/mongoose';
import {ModelType} from 'typegoose';
import {MapperService} from '../shared/mapper/mapper.service';

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

    async findRegistrationCode(code: string): Promise<Registration> {
        const registrationModel = await this._model.findOne({ code });
        if (!registrationModel) {
            const errors = { RegistrationCode: ' not found' };
            throw new HttpException({ errors }, 401);
        }
        return registrationModel;
    }
}
