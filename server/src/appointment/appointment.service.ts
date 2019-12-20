import {HttpService, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InstanceType, ModelType} from 'typegoose';
import {BaseService} from '../shared/base.service';
import {MapperService} from '../shared/mapper/mapper.service';
import {Appointment} from './models/appointment.model';
import {AppointmentParams} from './models/view-models/appointment-params.model';
import {AppointmentVm} from './models/view-models/appointment-vm.model';
import {User} from '../user/models/user.model';
import {UserRole} from '../user/models/user-role.enum';

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

    async createAppointment(params: AppointmentParams, user: string): Promise<AppointmentVm> {

        const newAppointment = Appointment.createModel();

        newAppointment.creator = user;
        newAppointment.title = params.title;
        newAppointment.content = params.content;
        newAppointment.global = params.global;
        newAppointment.allDay = params.allDay;
        newAppointment.backgroundColor = params.backgroundColor;

        if (params.daysOfWeek) {
            newAppointment.daysOfWeek = params.daysOfWeek;
            newAppointment.startRecur = params.startRecur;
            newAppointment.endRecur = params.endRecur;

            if (!params.allDay) {
                newAppointment.startTime = params.startTime;
                newAppointment.endTime = params.endTime;
            }

        } else {
            newAppointment.start = params.start;
            newAppointment.end = params.end;
        }

        try {
            const result = await this.create(newAppointment);
            return this.map2Vm(result);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    map2Vm(source: Appointment): AppointmentVm {
        const target: AppointmentVm = new AppointmentVm();
        target.title = source.title;
        target.allDay = source.allDay;
        target.backgroundColor = source.backgroundColor;
        target.extendedProps = {
            creator: source.creator,
            content: source.content,
            global: source.global,
        };

        if (source.daysOfWeek) {
            target.daysOfWeek = source.daysOfWeek;
            target.startRecur = source.startRecur;
            target.endRecur = source.endRecur;

            if (!source.allDay) {
                target.startTime = source.startTime;
                target.endTime = source.endTime;
            }

        } else {
            target.start = source.start;
            target.end = source.end;
        }

        return target;
    }

    async findLeadEvents(user: InstanceType<User>, filter, fromLead: InstanceType<Appointment>[]) {
        if (user.role === UserRole.Leader || user.role === UserRole.User) {
            filter['creator'] = user.leadUser;
            // filter relevant events - time
            fromLead = await this.findAll(filter);
            fromLead.forEach((appointment) => {
                if (!appointment.global) {
                    appointment.title = 'Blocked';
                }
            });
        }
        return fromLead;
    }
}
