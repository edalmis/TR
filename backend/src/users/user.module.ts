import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './orm/user.entity';
import { GameEntity } from './orm/game.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GameEntity]),

  ],
  providers: [
    UserService,
    JwtAuthService,
    AuthGuard,
  ],
  controllers: [UserController],

  exports: [UserModule, UserService, TypeOrmModule]
})
export class UserModule { }
