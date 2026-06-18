import { Document, PopulateOptions } from 'mongoose';
import mongoose, { AnyObject, Model, PaginateOptions, Types } from 'mongoose';
type PaginateModel<T> = { paginate(query?: any, options?: any): Promise<any> };
import { RequestContext } from 'nestjs-request-context';
import MyString from 'src/libraries/my-string';

export type TypePagination = {
  pagination?: {
    page: number;
    limit: number;
    sort?: AnyObject;
  };
  filter?: AnyObject;
  search?: string;
  searchs?: AnyObject;
  or?: AnyObject[];
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

const DANGEROUS_OPERATORS = new Set(['$where', '$function', '$accumulator']);

export class MongoService<T extends Document> {
  searchs: string[] = [];
  identities: string[] = ['_id'];
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

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private sanitizeOr(or: AnyObject[]): AnyObject[] {
    return or.map((item) => {
      const safe: AnyObject = {};
      for (const key of Object.keys(item)) {
        if (DANGEROUS_OPERATORS.has(key)) continue;
        safe[key] = item[key];
      }
      return safe;
    });
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
    for (const field of this.identities) {
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
    const orQuery: AnyObject[] = [];

    if (param.filter) {
      for (const key of Object.keys(param.filter)) {
        if (key.startsWith('$')) continue;
        const value = param.filter[key];
        if (Array.isArray(value)) {
          mainQuery[key] = { $in: value };
        } else if (typeof value === 'string' && Types.ObjectId.isValid(value) && value.length === 24) {
          mainQuery[key] = new Types.ObjectId(value);
        } else {
          mainQuery[key] = value;
        }
      }
    }

    if (param.search && this.searchs.length) {
      const safeSearch = this.escapeRegex(param.search);
      for (const f of this.searchs) {
        orQuery.push({
          [f]: { $regex: new RegExp(safeSearch), $options: 'i' },
        });
      }
    }

    if (param.searchs) {
      for (const key of Object.keys(param.searchs)) {
        const safeVal = this.escapeRegex(param.searchs[key]);
        orQuery.push({
          [key]: { $regex: new RegExp(safeVal), $options: 'i' },
        });
      }
    }

    if (param.or?.length) {
      orQuery.push(...this.sanitizeOr(param.or));
    }

    if (orQuery.length > 0) {
      where['$and'].push({ $or: orQuery });
    }

    const paginateModel = this.model as unknown as PaginateModel<T>;
    const result: mongoose.PaginateResult<T> = await paginateModel.paginate(
      where,
      {
        page: param?.pagination?.page || 1,
        limit: param?.pagination?.limit || 20,
        sort: param?.pagination?.sort || { _id: -1 },
        populate: param?.populates || this.defaultPopulates,
        select: param?.selects,
      } as PaginateOptions,
    );

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

  async insert(body: AnyObject): Promise<T> {
    const now = new Date().toISOString();
    const userId = this.currentUserId;
    const instant = new this.model({
      _id: new Types.ObjectId(),
      ...body,
      createdAt: now,
      userId: userId ?? null,
    });
    return this.model.create(instant);
  }

  async update(
    id: string | Types.ObjectId,
    body: AnyObject,
  ): Promise<T | null> {
    const doc = await this.model.findById(id);
    if (!doc) return null;
    Object.assign(doc, body);
    doc['updatedAt'] = new Date().toISOString();
    const userId = this.currentUserId;
    if (userId) doc['updatedUser'] = userId;
    return doc.save();
  }

  async setById(
    id: string | Types.ObjectId,
    body: AnyObject,
  ): Promise<T | null> {
    const userId = this.currentUserId;
    const set = {
      ...body,
      updatedAt: new Date().toISOString(),
      ...(userId ? { updatedUser: userId } : {}),
    };
    return this.model.findByIdAndUpdate(id, { $set: set } as any, {
      new: true,
    });
  }

  async deleteById(
    id: string | Types.ObjectId,
  ): Promise<{ deletedCount: number }> {
    const data = await this.model.deleteOne({ _id: id });
    return { deletedCount: data.deletedCount };
  }

  async deleteMany(query: AnyObject): Promise<{ deletedCount: number }> {
    const data = await this.model.deleteMany(query);
    return { deletedCount: data.deletedCount };
  }

  deleteManyById(
    ids: (string | Types.ObjectId)[],
  ): Promise<{ deletedCount: number }> {
    return this.deleteMany({ _id: { $in: ids } });
  }

  async insertWithRunning(
    body: AnyObject,
    field: string,
    paddingLength: number = 8,
    prefix: string = '',
  ): Promise<T> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const count = await this.model.countDocuments();
      const running = count + 1 + attempt;
      const codeRunning = MyString.formatNumberWithLeadingZeroes(
        running,
        paddingLength - prefix.length,
      );
      try {
        return await this.insert({ ...body, [field]: prefix + codeRunning });
      } catch (error: any) {
        if (error?.code === 11000 && attempt < 4) continue;
        throw error;
      }
    }
    throw new Error(`ไม่สามารถสร้าง running number สำหรับ ${field} ได้`);
  }
}
