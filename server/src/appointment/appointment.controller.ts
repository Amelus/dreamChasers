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

@Controller('appointment')
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
    async create(@Req() request, @Body() params: AppointmentParams): Promise<AppointmentVm> {
        const user: InstanceType<User> = request.user;

        if (!user) {
            throw new HttpException('Missing parameter user', HttpStatus.BAD_REQUEST);
        }

        try {
            return await this._appointmentService.createAppointment(params, user.username);
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
            filter['creator'] = user.username;
            created = await this._appointmentService.findAll(filter);
        }

        fromLead = await this._appointmentService.findLeadEvents(user, filter, fromLead);

        let appointments = [];
        appointments = appointments.concat(fromLead, created);

        if (appointments.length > 0) {
            try {
                return appointments.map((appointment) => {
                    return this._appointmentService.map2Vm(appointment);
                });
            } catch (e) {
                throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return [];
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
            return this._appointmentService.map2Vm(updated);
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
            return this._appointmentService.map2Vm(deleted);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}

export function EnumToArray(enumVariable: any): string[] {
    return Object.keys(enumVariable).map(k => enumVariable[k]);
}
