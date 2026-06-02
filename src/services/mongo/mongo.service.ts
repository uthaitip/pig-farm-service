import { Document, PopulateOptions } from 'mongoose';
import mongoose, { AnyObject, Model, PaginateOptions, Types } from 'mongoose';
import { RequestContext } from 'nestjs-request-context';

export type TypePagination = {
  pagination?: {
    page: number;
    limit: number;
    sort?: AnyObject;
  };
  filter?: AnyObject;
  search?: string;
  searchs?: AnyObject;
  or?: any[];
  populates?: PopulateOptions[];
  selects?: string[];
};

export type TypePaginationResult = {
  list: any[];
  total: number;
  page: number;
  pages: number;
};

export type TypeFindParam = {
  sort?: AnyObject;
  populates?: PopulateOptions[];
  selects?: string[];
};

export class MongoService<T extends Document> {
  searchs: string[] = [];
  defaultPopulates: PopulateOptions[] = [];
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  protected get currentUserId(): string | null {
    return RequestContext.currentContext?.res?.locals?.user?.id ?? null;
  }

  async afterFind(list: T[]): Promise<T[]> {
    return list;
  }

  async afterFindOne(item: T): Promise<T> {
    return item;
  }

  ObjectId(str?: string): Types.ObjectId {
    if (str && Types.ObjectId.isValid(str)) return new Types.ObjectId(str);
    return new Types.ObjectId();
  }

  async find(where: any, param?: TypeFindParam): Promise<T[]> {
    const query = this.model
      .find(where)
      .sort(param?.sort)
      .populate(param?.populates || this.defaultPopulates);
    if (param?.selects) query.select(param.selects);
    const docs = await query;
    const list = docs.map((item) => item.toObject()) as T[];
    return this.afterFind(list);
  }

  async findOne(where: any, param?: TypeFindParam): Promise<T | null> {
    const query = this.model
      .findOne(where)
      .sort(param?.sort)
      .populate(param?.populates || this.defaultPopulates);
    if (param?.selects) query.select(param.selects);
    const doc = await query;
    if (!doc) return null;
    return this.afterFindOne(doc.toObject() as T);
  }

  async findByIdentity(
    value: string,
    param?: TypeFindParam,
  ): Promise<T | null> {
    const identities: string[] = (this as any).identities || ['_id'];
    for (const field of identities) {
      const doc =
        field === '_id'
          ? await this.findById(value, param)
          : await this.findOne({ [field]: value }, param);
      if (doc) return doc;
    }
    return null;
  }

  async findById(
    id: string | Types.ObjectId,
    param?: TypeFindParam,
  ): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const query = this.model
      .findById(id)
      .populate(param?.populates || this.defaultPopulates);
    if (param?.selects) query.select(param.selects);
    const doc = await query;
    return doc ? (doc.toObject() as T) : null;
  }

  async pagination(param: TypePagination): Promise<TypePaginationResult> {
    const where: AnyObject = { $and: [{}] };
    const mainQuery = where['$and'][0];
    const orQuery: any[] = [];

    if (param.filter) {
      for (const key of Object.keys(param.filter)) {
        const value = param.filter[key];
        mainQuery[key] = Array.isArray(value) ? { $in: value } : value;
      }
    }

    if (param.search && this.searchs.length) {
      for (const f of this.searchs) {
        orQuery.push({
          [f]: { $regex: new RegExp(param.search), $options: 'i' },
        });
      }
    }

    if (param.searchs) {
      for (const key of Object.keys(param.searchs)) {
        orQuery.push({
          [key]: { $regex: new RegExp(param.searchs[key]), $options: 'i' },
        });
      }
    }

    if (param.or?.length) {
      orQuery.push(...param.or);
    }

    if (orQuery.length > 0) {
      where['$and'].push({ $or: orQuery });
    }

    const result: mongoose.PaginateResult<T> = await (
      this.model as any
    ).paginate(where, {
      page: param?.pagination?.page || 1,
      limit: param?.pagination?.limit || 20,
      sort: param?.pagination?.sort || { _id: -1 },
      populate: param?.populates || this.defaultPopulates,
      select: param?.selects,
    } as PaginateOptions);

    const list = result.docs.map((item: any) =>
      item.toObject ? item.toObject() : item,
    ) as T[];
    return {
      list: await this.afterFind(list),
      total: result.totalDocs,
      page: result.page || 1,
      pages: result.totalPages,
    };
  }

  insert(body: AnyObject): Promise<T> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const userId = this.currentUserId;
      const instant = new this.model({
        _id: new Types.ObjectId(),
        ...body,
        createdAt: now,
        userId: userId ?? null,
      });
      this.model
        .create(instant)
        .then((data) => resolve(data))
        .catch((e) => reject(e));
    });
  }

  update(id: string | Types.ObjectId, body: AnyObject): Promise<any> {
    return new Promise(async (resolve) => {
      const doc = await this.model.findById(id);
      if (doc) {
        Object.assign(doc, body);
        doc['updatedAt'] = new Date().toISOString();
        const userId = this.currentUserId;
        if (userId) doc['updatedUser'] = userId;
        resolve(doc.save());
      } else {
        resolve(null);
      }
    });
  }

  setById(id: string | Types.ObjectId, body: AnyObject): Promise<any> {
    return new Promise((resolve, reject) => {
      const userId = this.currentUserId;
      const set = {
        ...body,
        updatedAt: new Date().toISOString(),
        ...(userId ? { updatedUser: userId } : {}),
      };
      this.model
        .findByIdAndUpdate(id, { $set: set } as any, { new: true })
        .then((data) => resolve(data))
        .catch((e) => reject(e));
    });
  }

  deleteById(id: string | Types.ObjectId): Promise<{ deletedCount: number }> {
    return new Promise((resolve, reject) => {
      this.model
        .deleteOne({ _id: id })
        .then((data) => resolve({ deletedCount: data.deletedCount }))
        .catch((e) => reject(e));
    });
  }

  deleteMany(query: AnyObject): Promise<{ deletedCount: number }> {
    return new Promise((resolve, reject) => {
      this.model
        .deleteMany(query)
        .then((data) => resolve({ deletedCount: data.deletedCount }))
        .catch((e) => reject(e));
    });
  }

  deleteManyById(
    ids: (string | Types.ObjectId)[],
  ): Promise<{ deletedCount: number }> {
    return this.deleteMany({ _id: { $in: ids } });
  }
}
