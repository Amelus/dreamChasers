import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiImplicitQuery,
    ApiOkResponse,
    ApiOperation,
    ApiUseTags,
} from '@nestjs/swagger';
import {map} from 'lodash';
import {ApiException} from '../shared/api-exception.model';
import {GetOperationId} from '../shared/utilities/get-operation-id.helper';
import {Appointment} from './models/appointment.model';
import {AppointmentParams} from './models/view-models/appointment-params.model';
import {AppointmentVm} from './models/view-models/appointment-vm.model';
import {AppointmentService} from './appointment.service';
import {Roles} from '../shared/decorators/roles.decorator';
import {UserRole} from '../user/models/user-role.enum';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../shared/guards/roles.guard';
import {InstanceType} from 'typegoose';
import {User} from '../user/models/user.model';

@Controller('appointments')
@ApiUseTags(Appointment.modelName)
@ApiBearerAuth()
export class AppointmentController {
    constructor(private readonly _appointmentService: AppointmentService) {
    }

    @Post()
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({type: AppointmentVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Appointment.modelName, 'Create'))
    async create(@Body() params: AppointmentParams): Promise<AppointmentVm> {
        try {
            const newAppointment = await this._appointmentService.createAppointment(params);
            return this._appointmentService.map(newAppointment, Appointment, AppointmentVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: AppointmentVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Appointment.modelName, 'GetAll'))
    async getAll(@Req() request): Promise<AppointmentVm[]> {

        const user: InstanceType<User> = request.user;

        if (!user) {
            throw new HttpException('Missing parameter user', HttpStatus.BAD_REQUEST);
        }

        let created: InstanceType<Appointment>[] = [];
        let fromLead: InstanceType<Appointment>[] = [];
        const filter = {};

        if (user.role === UserRole.Admin || user.role === UserRole.Leader) {
            filter['extendedProps.creator'] = user;
            created = await this._appointmentService.findAll(filter);
        }

        if (user.role === UserRole.Leader || user.role === UserRole.User) {
            filter['extendedProps.creator'] = user.leadUser;
            filter['start'] = {$gte: 'Mon May 30 18:47:00 +0000 2015',
                $lt: 'Sun May 30 20:40:36 +0000 2010'};
            fromLead = await this._appointmentService.findAll(filter);
            fromLead.forEach((appointment) => {
                if (!appointment.extendedProps.global) {
                    appointment.title = 'Blocked';
                }
            });
        }

        let appointments = [];
        appointments = appointments.concat(fromLead, created);

        if (appointments.length > 0) {
            try {
                return this._appointmentService.mapArray(map(appointments, appointment => appointment.toJSON()), Appointment, AppointmentVm);
            } catch (e) {
                throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return null;
    }

    @Put()
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: AppointmentVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Appointment.modelName, 'Update'))
    async update(@Body() vm: AppointmentVm): Promise<AppointmentVm> {
        const {id} = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._appointmentService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }


        try {
            const updated = await this._appointmentService.update(id, exist);
            return this._appointmentService.map(updated.toJSON(), Appointment, AppointmentVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: AppointmentVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Appointment.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<AppointmentVm> {
        try {
            const deleted = await this._appointmentService.delete(id);
            return this._appointmentService.map(deleted.toJSON(), Appointment, AppointmentVm);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}

export function EnumToArray(enumVariable: any): string[] {
    return Object.keys(enumVariable).map(k => enumVariable[k]);
}
