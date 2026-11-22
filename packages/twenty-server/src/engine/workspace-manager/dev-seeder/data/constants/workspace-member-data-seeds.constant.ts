import {
  SEED_APPLE_WORKSPACE_ID,
  SEED_YCOMBINATOR_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { generateRandomUsers } from 'src/engine/workspace-manager/dev-seeder/core/utils/generate-random-users.util';
import { USER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-users.util';

type WorkspaceMemberDataSeed = {
  id: string;
  nameFirstName: string;
  nameLastName: string;
  locale: string;
  colorScheme: string;
  userEmail: string;
  userId: string;
};

export const WORKSPACE_MEMBER_DATA_SEED_COLUMNS: (keyof WorkspaceMemberDataSeed)[] =
  [
    'id',
    'nameFirstName',
    'nameLastName',
    'locale',
    'colorScheme',
    'userEmail',
    'userId',
  ];

export const WORKSPACE_MEMBER_DATA_SEED_IDS = {
  TIM: '20202020-0687-4c41-b707-ed1bfca972a7',
  JONY: '20202020-77d5-4cb6-b60a-f4a835a85d61',
  PHIL: '20202020-1553-45c6-a028-5a9064cce07f',
  JANE: '20202020-463f-435b-828c-107e007a2711',
  SCOTT: '20202020-1111-4a01-8001-000000000003',
};

const {
  workspaceMembers: randomWorkspaceMembers,
  workspaceMemberIds: randomWorkspaceMemberIds,
} = generateRandomUsers();

export const RANDOM_WORKSPACE_MEMBER_IDS = randomWorkspaceMemberIds;

const originalWorkspaceMembers: WorkspaceMemberDataSeed[] = [
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
    nameFirstName: 'Sales',
    nameLastName: 'Admin',
    locale: 'en',
    colorScheme: 'Light',
    userEmail: 'admin@sterlitee.in',
    userId: USER_DATA_SEED_IDS.TIM,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.JONY,
    nameFirstName: 'Aditya',
    nameLastName: 'Rane',
    locale: 'en',
    colorScheme: 'Light',
    userEmail: 'aditya.rane@sterlitee.in',
    userId: USER_DATA_SEED_IDS.JONY,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.PHIL,
    nameFirstName: 'Shruti',
    nameLastName: 'Phadke',
    locale: 'en',
    colorScheme: 'Light',
    userEmail: 'shruti.phadke@sterlitee.in',
    userId: USER_DATA_SEED_IDS.PHIL,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.JANE,
    nameFirstName: 'Meghna',
    nameLastName: 'Salvi',
    locale: 'en',
    colorScheme: 'Light',
    userEmail: 'meghna.salvi@sterlitee.in',
    userId: USER_DATA_SEED_IDS.JANE,
  },
];

// Rohan only belongs to the Sterlitee Realty workspace (he has no Sterlitee Partners
// user-workspace), so he must never leak into other workspaces' member seeds.
const realtyOnlyWorkspaceMembers: WorkspaceMemberDataSeed[] = [
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.SCOTT,
    nameFirstName: 'Rohan',
    nameLastName: 'Kulkarni',
    locale: 'en',
    colorScheme: 'Light',
    userEmail: 'rohan.kulkarni@sterlitee.in',
    userId: USER_DATA_SEED_IDS.SCOTT,
  },
];

export const WORKSPACE_MEMBER_DATA_SEEDS: WorkspaceMemberDataSeed[] = [
  ...originalWorkspaceMembers,
  ...randomWorkspaceMembers,
];

export const getWorkspaceMemberDataSeeds = (
  workspaceId: string,
): WorkspaceMemberDataSeed[] => {
  // In test environment, only return original members to avoid conflicts
  // (Rohan is appended for Sterlitee Realty to back the impersonation escalation test).
  if (process.env.NODE_ENV === 'test') {
    return workspaceId === SEED_APPLE_WORKSPACE_ID
      ? [...originalWorkspaceMembers, ...realtyOnlyWorkspaceMembers]
      : originalWorkspaceMembers;
  }

  if (workspaceId === SEED_APPLE_WORKSPACE_ID) {
    // Sterlitee Realty workspace gets all workspace members (original + random + Rohan)
    return [...WORKSPACE_MEMBER_DATA_SEEDS, ...realtyOnlyWorkspaceMembers];
  } else if (workspaceId === SEED_YCOMBINATOR_WORKSPACE_ID) {
    // Partners workspace gets all 4 original workspace members
    return originalWorkspaceMembers;
  }

  return originalWorkspaceMembers;
};
