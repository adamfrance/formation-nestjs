import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RoomsModule } from './rooms/rooms.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

@Module({
  imports: [RoomsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
