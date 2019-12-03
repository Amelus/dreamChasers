import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
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
import {InstanceType} from 'typegoose';
import {User} from '../user/models/user.model';

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
    async create(@Req() request, @Body() params: TodoParams): Promise<TodoVm> {
        try {
            const newTodo = await this._todoService.createTodo(params, request.user.username);
            return this._todoService.map(newTodo, Todo, TodoVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('assigned')
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: TodoVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'GetAssigned'))
    async getAllAssigned(@Req() request): Promise<TodoVm[]> {

        const assignee: InstanceType<User> = request.user;
        const filter = {};
        filter['assignee'] = assignee.username;

        try {
            const todos = await this._todoService.findAll(filter);
            return this._todoService.mapArray(map(todos, todo => todo.toJSON()), Todo, TodoVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('created')
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: TodoVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'GetCreated'))
    async getAllCreated(@Req() request): Promise<TodoVm[]> {

        const creator: InstanceType<User> = request.user;
        const filter = {};
        filter['creator'] = creator.username;

        try {
            const todos = await this._todoService.findAll(filter);
            return this._todoService.mapArray(map(todos, todo => todo.toJSON()), Todo, TodoVm);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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

    @Delete('/delete')
    @Roles(UserRole.Admin, UserRole.Leader)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOkResponse({type: TodoVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Todo.modelName, 'Delete'))
    async delete(@Req() request, @Body() ids: string[]): Promise<Promise<TodoVm>[]> {

        if (ids === undefined || ids === null || ids.length <= 0) {
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        return ids.map(async (id) => {
            try {
                const deleted = await this._todoService.delete(id);
                return this._todoService.map(deleted.toJSON(), Todo, TodoVm);
            } catch (e) {
                throw new InternalServerErrorException(e);
            }
        });
    }

}

export function EnumToArray(enumVariable: any): string[] {
    return Object.keys(enumVariable).map(k => enumVariable[k]);
}
