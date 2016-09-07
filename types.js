// @flow

declare class Err {
  message: string;
}

declare class Cursor {
  toArray(callback: Function): void;
}

declare class Collection {
  find(query?: Object, projection?: Object): Cursor;
  insert(document: Object, writeConcert?: Object, ordered?: boolean): void;
  update(query: Object, update: Object, callback: Function, upsert?: boolean, multi?: boolean, writeConcern?: boolean): void; // eslint-disable-line
  remove(query: Object, callback?: Function, justOne?: boolean, writeConcern?: Object): void;
  count(query: Object, callback?: Function, options?: Object): void;
  aggregate(pipeline: Array<any>, options?: Object): Cursor;
}

declare class DB {
  collection(name: string): Collection;
  close(): void;
}

declare class Documents extends Array<any> {
}

declare class MongoClient {
  connect(url: string, callback: Function): void;
}
