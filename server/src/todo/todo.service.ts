import {HttpException, HttpService, HttpStatus, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {ModelType} from 'typegoose';
import {BaseService} from '../shared/base.service';
import {MapperService} from '../shared/mapper/mapper.service';
import {Todo} from './models/todo.model';
import {TodoParams} from './models/view-models/todo-params.model';
import {TodoStatus} from './models/todo-status.enum';

@Injectable()
export class TodoService extends BaseService<Todo> {
    constructor(
        private readonly httpService: HttpService,
        @InjectModel(Todo.modelName) private readonly _todoModel: ModelType<Todo>,
        private readonly _mapperService: MapperService,
    ) {
        super();
        this._model = _todoModel;
        this._mapper = _mapperService.mapper;
    }

    async createTodo(params: TodoParams): Promise<Todo> {
        const {creator, assignee, title, content, dueDate, status} = params;

        const newTodo = Todo.createModel();

        newTodo.creator = creator;
        newTodo.assignee = assignee;
        newTodo.title = title;
        newTodo.content = content;
        newTodo.dueDate = dueDate;

        if (status) {
            newTodo.status = status;
        } else {
            newTodo.status = TodoStatus.InProgress;
        }

        try {
            const result = await this.create(newTodo);
            return result.toJSON() as Todo;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
