import { isDefined } from 'twenty-shared/utils';

import { COMPANY_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/company-data-seeds.constant';
import { PERSON_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/person-data-seeds.constant';
import {
  WORKSPACE_MEMBER_DATA_SEED_IDS,
  WORKSPACE_MEMBER_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type OpportunityDataSeed = {
  id: string;
  name: string;
  amountAmountMicros: number;
  amountCurrencyCode: string;
  closeDate: Date;
  stage: string;
  position: number;
  pointOfContactId: string;
  companyId: string;
  ownerId: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
};

export const OPPORTUNITY_DATA_SEED_COLUMNS: (keyof OpportunityDataSeed)[] = [
  'id',
  'name',
  'amountAmountMicros',
  'amountCurrencyCode',
  'closeDate',
  'stage',
  'position',
  'pointOfContactId',
  'companyId',
  'ownerId',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
];

const OPPORTUNITY_DATA_SEED_COUNT = 150;

const GENERATE_OPPORTUNITY_IDS = (): Record<string, string> => {
  const OPPORTUNITY_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= OPPORTUNITY_DATA_SEED_COUNT; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    OPPORTUNITY_IDS[`ID_${INDEX}`] =
      `50505050-${HEX_INDEX}-4e7c-8001-123456789abc`;
  }

  return OPPORTUNITY_IDS;
};

export const OPPORTUNITY_DATA_SEED_IDS = GENERATE_OPPORTUNITY_IDS();

const OPPORTUNITY_TEMPLATES = [
  { name: 'Penthouse Tower A-1704 – Regal Park', amount: 16000000, stage: 'NEW' },
  { name: '4BHK Tower B-604 – Regal Park', amount: 5800000, stage: 'SCREENING' },
  { name: '1BHK Tower C-2101 – Regal Park', amount: 2500000, stage: 'MEETING' },
  { name: 'Penthouse Tower D-1205 – Regal Park', amount: 9500000, stage: 'PROPOSAL' },
  { name: '4BHK Tower E-1201 – Regal Park', amount: 22000000, stage: 'CUSTOMER' },
  { name: '1BHK Tower A-804 – Regal Park', amount: 30000000, stage: 'NEW' },
  { name: 'Penthouse Tower B-901 – Regal Park', amount: 3200000, stage: 'SCREENING' },
  { name: '2.5BHK Tower C-1706 – Regal Park', amount: 3200000, stage: 'MEETING' },
  { name: '4BHK Tower D-706 – Regal Park', amount: 22000000, stage: 'PROPOSAL' },
  { name: '2.5BHK Tower E-1204 – Regal Park', amount: 16000000, stage: 'CUSTOMER' },
  { name: '4BHK Tower A-2003 – Regal Park', amount: 5800000, stage: 'NEW' },
  { name: '2BHK Tower B-1005 – Regal Park', amount: 12000000, stage: 'SCREENING' },
  { name: 'Penthouse Tower C-1806 – Regal Park', amount: 22000000, stage: 'MEETING' },
  { name: 'Penthouse Tower D-503 – Regal Park', amount: 4500000, stage: 'PROPOSAL' },
  { name: 'Penthouse Tower E-1001 – Regal Park', amount: 30000000, stage: 'CUSTOMER' },
  { name: '2.5BHK Tower A-2405 – Regal Park', amount: 16000000, stage: 'NEW' },
  { name: '3BHK Tower B-1005 – Regal Park', amount: 4500000, stage: 'SCREENING' },
  { name: '3BHK Tower C-1101 – Regal Park', amount: 16000000, stage: 'MEETING' },
  { name: '2.5BHK Tower D-601 – Regal Park', amount: 5800000, stage: 'PROPOSAL' },
  { name: '2.5BHK Tower E-2204 – Regal Park', amount: 9500000, stage: 'CUSTOMER' },
  { name: 'Penthouse Tower A-2303 – Regal Park', amount: 3200000, stage: 'NEW' },
  { name: 'Penthouse Tower B-602 – Regal Park', amount: 9500000, stage: 'SCREENING' },
  { name: '4BHK Tower C-2303 – Regal Park', amount: 7500000, stage: 'MEETING' },
  { name: '2BHK Tower D-301 – Regal Park', amount: 5800000, stage: 'PROPOSAL' },
  { name: 'Penthouse Tower E-2305 – Regal Park', amount: 2500000, stage: 'CUSTOMER' },
  { name: 'Penthouse Tower A-1004 – Regal Park', amount: 2500000, stage: 'NEW' },
  { name: 'Penthouse Tower B-1505 – Regal Park', amount: 22000000, stage: 'SCREENING' },
  { name: '4BHK Tower C-2202 – Regal Park', amount: 4500000, stage: 'MEETING' },
  { name: '1BHK Tower D-806 – Regal Park', amount: 9500000, stage: 'PROPOSAL' },
  { name: '1BHK Tower E-1704 – Regal Park', amount: 5800000, stage: 'CUSTOMER' },
  { name: '2BHK Tower A-1901 – Regal Park', amount: 7500000, stage: 'NEW' },
  { name: 'Penthouse Tower B-506 – Regal Park', amount: 9500000, stage: 'SCREENING' },
  { name: '3BHK Tower C-1005 – Regal Park', amount: 7500000, stage: 'MEETING' },
  { name: '2BHK Tower D-1804 – Regal Park', amount: 4500000, stage: 'PROPOSAL' },
  { name: '2.5BHK Tower E-405 – Regal Park', amount: 4500000, stage: 'CUSTOMER' },
  { name: '1BHK Tower A-1803 – Regal Park', amount: 16000000, stage: 'NEW' },
  { name: '3BHK Tower B-1101 – Regal Park', amount: 16000000, stage: 'SCREENING' },
  { name: '4BHK Tower C-1303 – Regal Park', amount: 4500000, stage: 'MEETING' },
  { name: '1BHK Tower D-805 – Regal Park', amount: 5800000, stage: 'PROPOSAL' },
  { name: '4BHK Tower E-604 – Regal Park', amount: 3200000, stage: 'CUSTOMER' },
  { name: '4BHK Tower A-1903 – Regal Park', amount: 16000000, stage: 'NEW' },
  { name: '3BHK Tower B-1402 – Regal Park', amount: 12000000, stage: 'SCREENING' },
  { name: '1BHK Tower C-1903 – Regal Park', amount: 12000000, stage: 'MEETING' },
  { name: '2BHK Tower D-2404 – Regal Park', amount: 3200000, stage: 'PROPOSAL' },
  { name: '2BHK Tower E-1202 – Regal Park', amount: 4500000, stage: 'CUSTOMER' },
  { name: '3BHK Tower A-702 – Regal Park', amount: 16000000, stage: 'NEW' },
  { name: '4BHK Tower B-1801 – Regal Park', amount: 2500000, stage: 'SCREENING' },
  { name: '4BHK Tower C-1603 – Regal Park', amount: 4500000, stage: 'MEETING' },
  { name: '3BHK Tower D-1602 – Regal Park', amount: 9500000, stage: 'PROPOSAL' },
  { name: '4BHK Tower E-1801 – Regal Park', amount: 3200000, stage: 'CUSTOMER' },
];

const GENERATE_OPPORTUNITY_SEEDS = (): OpportunityDataSeed[] => {
  const OPPORTUNITY_SEEDS: OpportunityDataSeed[] = [];

  for (let INDEX = 1; INDEX <= OPPORTUNITY_DATA_SEED_COUNT; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1) % OPPORTUNITY_TEMPLATES.length;
    const TEMPLATE = OPPORTUNITY_TEMPLATES[TEMPLATE_INDEX];

    const DAYS_AHEAD = Math.floor(Math.random() * 90) + 1;
    const CLOSE_DATE = new Date();

    CLOSE_DATE.setDate(CLOSE_DATE.getDate() + DAYS_AHEAD);

    const workspaceMemberId = Object.values(WORKSPACE_MEMBER_DATA_SEED_IDS)[
      INDEX % 4
    ];
    const workspaceMember = WORKSPACE_MEMBER_DATA_SEEDS.find(
      (workspaceMember) => workspaceMember.id === workspaceMemberId,
    );
    const workspaceMemberName = isDefined(workspaceMember)
      ? `${workspaceMember?.nameFirstName} ${workspaceMember?.nameLastName}`
      : 'Unkonwn';

    const rawSeed: OpportunityDataSeed = {
      id: OPPORTUNITY_DATA_SEED_IDS[`ID_${INDEX}`],
      name: TEMPLATE.name,
      amountAmountMicros: TEMPLATE.amount * 1000000,
      amountCurrencyCode: 'INR',
      closeDate: CLOSE_DATE,
      stage: TEMPLATE.stage,
      position: INDEX,
      pointOfContactId:
        PERSON_DATA_SEED_IDS[
          `ID_${INDEX}` as keyof typeof PERSON_DATA_SEED_IDS
        ] || PERSON_DATA_SEED_IDS.ID_1,
      companyId:
        COMPANY_DATA_SEED_IDS[
          `ID_${Math.ceil(INDEX / 2)}` as keyof typeof COMPANY_DATA_SEED_IDS
        ] || COMPANY_DATA_SEED_IDS.ID_1,
      ownerId: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
      createdBySource: 'MANUAL',
      updatedBySource: 'MANUAL',
      createdByWorkspaceMemberId: workspaceMemberId,
      createdByName: workspaceMemberName,
      updatedByWorkspaceMemberId: workspaceMemberId,
      updatedByName: workspaceMemberName,
    };

    const opportunityDataSeedWithSQLColumnOrder: OpportunityDataSeed =
      Object.fromEntries(
        OPPORTUNITY_DATA_SEED_COLUMNS.map((column) => [
          column,
          rawSeed[column as keyof OpportunityDataSeed],
        ]),
      ) as OpportunityDataSeed;

    OPPORTUNITY_SEEDS.push(opportunityDataSeedWithSQLColumnOrder);
  }

  return OPPORTUNITY_SEEDS;
};

export const OPPORTUNITY_DATA_SEEDS = GENERATE_OPPORTUNITY_SEEDS();
