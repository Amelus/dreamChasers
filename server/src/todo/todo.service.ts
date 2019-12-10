import {HttpException, HttpService, HttpStatus, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InstanceType, ModelType} from 'typegoose';
import {BaseService} from '../shared/base.service';
import {MapperService} from '../shared/mapper/mapper.service';
import {Todo} from './models/todo.model';
import {TodoParams} from './models/view-models/todo-params.model';
import {TodoStatus} from './models/todo-status.enum';
import {UserService} from '../user/user.service';
import {User} from '../user/models/user.model';

@Injectable()
export class TodoService extends BaseService<Todo> {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Todo.modelName) private readonly _todoModel: ModelType<Todo>,
        private readonly _mapperService: MapperService,
        private userService: UserService,
    ) {
        super();
        this._model = _todoModel;
        this._mapper = _mapperService.mapper;
    }

    async createTodo(params: TodoParams, requestCreator: string): Promise<Todo> {
        const {creator, assignee, title, content, dueDate, status} = params;

        const newTodo = Todo.createModel();

        newTodo.creator = creator !== null ? creator : requestCreator;
        newTodo.title = title;
        newTodo.content = content;
        newTodo.dueDate = dueDate;

        if (status) {
            newTodo.status = status;
        } else {
            newTodo.status = TodoStatus.Pending;
        }

        let exist: InstanceType<User>;
        try {
            exist = await this.userService.findOne({username: assignee});
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!exist) {
            throw new HttpException(`${assignee} does not exist`, HttpStatus.BAD_REQUEST);
        }

        newTodo.assignee = exist.username;
        newTodo.userImage = exist.imageUrl;

        try {
            const result = await this.create(newTodo);
            return result.toJSON() as Todo;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
