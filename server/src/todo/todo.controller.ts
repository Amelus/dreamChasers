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
import {Todo} from './models/todo.model';
import {TodoParams} from './models/view-models/todo-params.model';
import {TodoVm} from './models/view-models/todo-vm.model';
import {TodoService} from './todo.service';
import {Roles} from '../shared/decorators/roles.decorator';
import {UserRole} from '../user/models/user-role.enum';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../shared/guards/roles.guard';

@Controller('todos')
@ApiUseTags(Todo.modelName)
@ApiBearerAuth()
export class TodoController {
    constructor(private readonly _todoService: TodoService) {
    }

    @Post()
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiCreatedResponse({type: TodoVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'Create'))
    async create(@Body() params: TodoParams): Promise<TodoVm> {
        try {
            const newTodo = await this._todoService.createTodo(params);
            return this._todoService.map(newTodo, Todo, TodoVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('assigned')
    @Roles(UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: TodoVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'GetAssigned'))
    @ApiImplicitQuery({name: 'assignee', required: true})
    async getAllAssigned(@Query('assignee') assignee?: string): Promise<TodoVm[]> {

        if (!assignee) {
            throw new HttpException('Missing parameter assignee', HttpStatus.BAD_REQUEST);
        }

        const filter = {};
        filter['assignee'] = assignee;

        try {
            const todos = await this._todoService.findAll(filter);
            return this._todoService.mapArray(map(todos, todo => todo.toJSON()), Todo, TodoVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('created')
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: TodoVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'GetCreated'))
    @ApiImplicitQuery({name: 'creator', required: true})
    async getAllCreated(@Query('creator') creator?: string): Promise<TodoVm[]> {

        if (!creator) {
            throw new HttpException('Missing parameter creator', HttpStatus.BAD_REQUEST);
        }

        const filter = {};
        filter['creator'] = creator;

        try {
            const todos = await this._todoService.findAll(filter);
            return this._todoService.mapArray(map(todos, todo => todo.toJSON()), Todo, TodoVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    // @Roles(UserRole.Admin, UserRole.User)
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: TodoVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'Update'))
    async update(@Body() vm: TodoVm): Promise<TodoVm> {
        const {id, content, status, isCompleted} = vm;

        if (!vm || !id) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._todoService.findById(id);

        if (!exist) {
            throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
        }

        if (exist.isCompleted) {
            throw new HttpException('Already completed', HttpStatus.BAD_REQUEST);
        }

        exist.content = content;
        exist.isCompleted = isCompleted;
        exist.status = status;

        try {
            const updated = await this._todoService.update(id, exist);
            return this._todoService.map(updated.toJSON(), Todo, TodoVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: TodoVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'Delete'))
    async delete(@Param('id') id: string): Promise<TodoVm> {
        try {
            const deleted = await this._todoService.delete(id);
            return this._todoService.map(deleted.toJSON(), Todo, TodoVm);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}

export function EnumToArray(enumVariable: any): string[] {
    return Object.keys(enumVariable).map(k => enumVariable[k]);
}
