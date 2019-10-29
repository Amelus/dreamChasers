import {HttpService, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {ModelType} from 'typegoose';
import {BaseService} from '../shared/base.service';
import {MapperService} from '../shared/mapper/mapper.service';
import {Appointment} from './models/appointment.model';
import {AppointmentParams} from './models/view-models/appointment-params.model';

@Injectable()
export class AppointmentService extends BaseService<Appointment> {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Appointment.modelName) private readonly _appointmentModel: ModelType<Appointment>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _appointmentModel;
        this._mapper = _mapperService.mapper;
    }

    async createAppointment(params: AppointmentParams): Promise<Appointment> {
        const {creator, title, content, startDate, endDate} = params;

        const newAppointment = Appointment.createModel();

        newAppointment.creator = creator;
        newAppointment.title = title;
        newAppointment.content = content;
        newAppointment.startDate = startDate;
        newAppointment.endDate = endDate;

        try {
            const result = await this.create(newAppointment);
            return result.toJSON() as Appointment;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
