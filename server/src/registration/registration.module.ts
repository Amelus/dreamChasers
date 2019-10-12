import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Registration } from './models/registration.model';
import { RegistrationService } from './registration.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Registration.modelName, schema: Registration.model.schema }]), HttpModule],
    controllers: [],
    providers: [RegistrationService],
})
export class RegistrationModule {
}
