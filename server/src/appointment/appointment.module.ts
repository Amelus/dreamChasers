import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment } from './models/appointment.model';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import {UserModule} from '../user/user.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Appointment.modelName, schema: Appointment.model.schema }]), HttpModule, UserModule],
    controllers: [AppointmentController],
    providers: [AppointmentService],
})
export class AppointmentModule {
}
