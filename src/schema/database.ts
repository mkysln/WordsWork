import Realm from 'realm';

export class Word extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  english!: string;
  turkish!: string;
  level!: number;
  isArchived!: boolean;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Word',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      english: 'string',
      turkish: 'string',
      level: { type: 'int', default: 1 },
      isArchived: { type: 'bool', default: false },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
