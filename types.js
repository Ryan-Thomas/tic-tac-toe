// @flow

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

declare class Socket {
  write(data: any): void;
  end(data?: any): void;
}

declare class Stream {
  pipe(dest: Stream): Stream;
}

declare class ReadStream extends Stream {}

declare class Request extends Stream {
  url: string;
  body: any;
  params: Object;
  query: Object;
}

declare class Response extends Stream {
  writeHead(statusCode: number, headers?: Object, statusMessage?: string): void;
  write(data: any): void;
  end(data?: any, encoding?: string, callback?: Function): void;
  render(view: string, locals?: Object, callback?: Function): void;
  send(data: Object): void;
}
