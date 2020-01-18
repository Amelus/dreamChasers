import {Test, TestingModule} from '@nestjs/testing';
import {AppointmentController} from './appointment.controller';

describe('Appointment Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AppointmentController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AppointmentController = module.get<AppointmentController>(AppointmentController);
    expect(controller).toBeDefined();
  });
});
