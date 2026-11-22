import { type QueryRunner } from 'typeorm';

import { generateRandomUsers } from './generate-random-users.util';

const tableName = 'user';

export const USER_DATA_SEED_IDS = {
  JANE: '20202020-e6b5-4680-8a32-b8209737156b',
  TIM: '20202020-9e3b-46d4-a556-88b9ddc2b034',
  JONY: '20202020-3957-4908-9c36-2929a23f8357',
  PHIL: '20202020-7169-42cf-bc47-1cfef15264b8',
  SCOTT: '20202020-1111-4a01-8001-000000000001',
};

const { users: randomUsers, userIds: randomUserIds } = generateRandomUsers();

export const RANDOM_USER_IDS = randomUserIds;

type SeedUsersArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
};

export const seedUsers = async ({ queryRunner, schemaName }: SeedUsersArgs) => {
  const originalUsers = [
    {
      id: USER_DATA_SEED_IDS.TIM,
      firstName: 'Sales',
      lastName: 'Admin',
      email: 'admin@sterlitee.in',
      passwordHash:
        '$2b$10$O0QPkikAjzRcvpPA/h8wceY6RkGjMGmVnF7zlHgd6uLF6ll0TtTc2', // Sterlitee@123
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.JONY,
      firstName: 'Aditya',
      lastName: 'Rane',
      email: 'aditya.rane@sterlitee.in',
      passwordHash:
        '$2b$10$O0QPkikAjzRcvpPA/h8wceY6RkGjMGmVnF7zlHgd6uLF6ll0TtTc2', // Sterlitee@123
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.PHIL,
      firstName: 'Shruti',
      lastName: 'Phadke',
      email: 'shruti.phadke@sterlitee.in',
      passwordHash:
        '$2b$10$O0QPkikAjzRcvpPA/h8wceY6RkGjMGmVnF7zlHgd6uLF6ll0TtTc2', // Sterlitee@123
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.JANE,
      firstName: 'Meghna',
      lastName: 'Salvi',
      email: 'meghna.salvi@sterlitee.in',
      passwordHash:
        '$2b$10$O0QPkikAjzRcvpPA/h8wceY6RkGjMGmVnF7zlHgd6uLF6ll0TtTc2', // Sterlitee@123
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.SCOTT,
      firstName: 'Rohan',
      lastName: 'Kulkarni',
      email: 'rohan.kulkarni@sterlitee.in',
      passwordHash:
        '$2b$10$O0QPkikAjzRcvpPA/h8wceY6RkGjMGmVnF7zlHgd6uLF6ll0TtTc2', // Sterlitee@123
      canImpersonate: false,
      canAccessFullAdminPanel: false,
      isEmailVerified: true,
    },
  ];

  const allUsers = [...originalUsers, ...randomUsers];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'id',
      'firstName',
      'lastName',
      'email',
      'passwordHash',
      'canImpersonate',
      'canAccessFullAdminPanel',
      'isEmailVerified',
    ])
    .orIgnore()
    .values(allUsers)
    .execute();
};
