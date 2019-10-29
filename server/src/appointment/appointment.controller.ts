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

    @Get('assigned')
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: AppointmentVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Appointment.modelName, 'GetAssigned'))
    @ApiImplicitQuery({name: 'assignee', required: true})
    async getAllAssigned(@Query('assignee') assignee?: string): Promise<AppointmentVm[]> {

        if (!assignee) {
            throw new HttpException('Missing parameter assignees', HttpStatus.BAD_REQUEST);
        }

        const filter = {};
        filter['assignees'] = assignee;

        try {
            const appointments = await this._appointmentService.findAll(filter);
            return this._appointmentService.mapArray(map(appointments, appointment => appointment.toJSON()), Appointment, AppointmentVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('created')
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: AppointmentVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Appointment.modelName, 'GetCreated'))
    @ApiImplicitQuery({name: 'creator', required: true})
    async getAllCreated(@Query('creator') creator?: string): Promise<AppointmentVm[]> {

        if (!creator) {
            throw new HttpException('Missing parameter creator', HttpStatus.BAD_REQUEST);
        }

        const filter = {};
        filter['creator'] = creator;

        try {
            const appointments = await this._appointmentService.findAll(filter);
            return this._appointmentService.mapArray(map(appointments, appointment => appointment.toJSON()), Appointment, AppointmentVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: AppointmentVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Appointment.modelName, 'Update'))
    async update(@Body() vm: AppointmentVm): Promise<AppointmentVm> {
        const {id, content} = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._appointmentService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        exist.content = content;

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
