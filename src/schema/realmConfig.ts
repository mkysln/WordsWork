// realmConfig.ts
import { createRealmContext } from '@realm/react';
import { Word } from './database'; // Word modelinizi import edin

export const WordRealmContext = createRealmContext({
  schema: [Word],
  schemaVersion: 6,
  deleteRealmIfMigrationNeeded: true, // Production'da bunu false yapmayı unutmayın
});
