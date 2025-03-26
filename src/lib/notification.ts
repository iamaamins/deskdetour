import { MOVE_TIME, VIEW_TIME, WORK_TIME } from './config';

export const NOTIFICATION = {
  work: {
    title: 'Work Time!',
    body: `Back to work! Next break in ${WORK_TIME / 60} minutes`,
  },
  view: {
    title: 'View Time!',
    body: `Look 20 feet further for ${VIEW_TIME} seconds`,
  },
  move: {
    title: 'Move Time!',
    body: `Move/exercise for ${MOVE_TIME / 60} minutes`,
  },
} as const;
