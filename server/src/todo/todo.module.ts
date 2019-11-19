import {HttpModule, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Todo} from './models/todo.model';
import {TodoController} from './todo.controller';
import {TodoService} from './todo.service';
import {UserModule} from '../user/user.module';

@Module({
    imports: [MongooseModule.forFeature([{name: Todo.modelName, schema: Todo.model.schema}]), HttpModule, UserModule],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule {
}
