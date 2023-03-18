import {
  additional,
  stateManagers,
  testing,
  animations,
  fetchData,
  router,
  forms,
  ui,
} from './linksData.js';
import { authorization, dataBase, frameLib } from './nodeJsLinks.js';

export const libList = [
  [
    { text: 'State', callback_data: 'State' },
    { text: 'Router', callback_data: 'Router' },
  ],
  [
    { text: 'Forms / Validation', callback_data: 'Forms / Validation' },
    { text: 'Fetch Data', callback_data: 'Fetch Data' },
  ],
  [
    { text: 'UI / Styles', callback_data: 'UI / Styles' },
    { text: 'Animation', callback_data: 'Animation' },
  ],
  [
    { text: 'Testing', callback_data: 'Testing' },
    { text: 'Additional', callback_data: 'Additional' },
  ],
];

export const nodeJsList = [
  [
    { text: 'Frame / Lib', callback_data: 'Frame / Lib' },
    { text: 'Auth', callback_data: 'Auth' },
    { text: 'DB / ORM', callback_data: 'DB / ORM' },
    { text: 'Additional', callback_data: 'Additional' },
  ],
];

export const links = {
  State: stateManagers,
  Animation: animations,
  Testing: testing,
  'Fetch Data': fetchData,
  Router: router,
  'Forms / Validation': forms,
  'UI / Styles': ui,
  Additional: additional,
};

export const nodeLinks = {
  'Frame / Lib': frameLib,
  Auth: authorization,
  'DB / ORM': dataBase,
  Additional: additional,
};
