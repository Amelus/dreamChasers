import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {User} from './models/user.model';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {CodeModule} from '../code/code.module';

@Module({
    imports: [MongooseModule.forFeature([{name: User.modelName, schema: User.model.schema}]),
        CodeModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {
}
