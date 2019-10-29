import {HttpModule, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Code} from './models/code.model';
import {CodeService} from './code.service';

@Module({
    imports: [MongooseModule.forFeature([{
        name: Code.modelName,
        schema: Code.model.schema,
    }]), HttpModule],
    providers: [CodeService],
    controllers: [],
    exports: [CodeService],
})
export class CodeModule {
}
