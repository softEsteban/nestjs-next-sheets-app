import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/database/entities/user.entity';
import { UserType } from '../src/types/user.type';

describe('UserController (e2e)', () => {
    let app: INestApplication;

    const mockUsers = [
        {
            user_name: "John",
            user_lastname: "Doe",
            user_type: UserType.CLIENT,
            user_password: "password123*ñ",
            user_email: "john-doe@gmail.com",
            user_avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            profile_id: 1
        }
    ];

    const mockUsersRepository = {
        find: jest.fn().mockResolvedValue(mockUsers)
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
        })
            .overrideProvider(getRepositoryToken(User))
            .useValue(mockUsersRepository)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    // Test 1
    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect(mockUsers);
    });
});
