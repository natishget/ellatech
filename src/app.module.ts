import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  // 2. TypeORM Connection Setup
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'postgres'>('DB_TYPE'),
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        
        // This setting tells TypeORM where to find your Entity classes (models)
        entities: [__dirname + '/**/*.entity{.ts,.js}'], 
        
        // **IMPORTANT:** Use migrations, not synchronize, in production.
        // For development/initial setup, you can set it to true briefly.
        // Required for this assignment: set to false and use TypeORM migrations.
        synchronize: false, 
      }),
    }),
  ProductModule,
  UserModule,
  TransactionModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
