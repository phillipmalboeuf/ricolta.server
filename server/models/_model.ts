
import { ObjectId, Db } from 'mongodb'

export default class Model {
  static db: Db = null
  static collection: string = 'models'
  static sort = []


  static preprocess(data: any) {
    return Promise.resolve(data)
  }

  static postprocess(data: any) {
    return Promise.resolve(data)
  }


  static list(filters, limit=50, page=0, sort?) {
    delete filters.limit
    delete filters.page
    delete filters.sort
    return this.db.collection(this.collection).find(filters, { limit, skip: limit ? page * limit : 0, sort: sort || this.sort }).toArray()
      .then(models => Promise.all(models.map(model => this.postprocess(model))))
  }


  static get(_id) {
    return this.get_where({ _id: new ObjectId(_id) })
  }

  static get_where(filters) {
    return this.db.collection(this.collection).findOne(filters)
      .then(model => this.postprocess(model))
  }

  static create(data) {
    return this.preprocess(data).then(data =>
      this.db.collection(this.collection).insertOne(data)
    ).then(result => ({ _id: result.insertedId }))
  }

  static update(_id, data) {
    return this.update_where({ _id: new ObjectId(_id) }, data)
  }

  static update_where(filters, data) {
    return this.preprocess(data).then(data =>
      this.db.collection(this.collection).findOneAndUpdate(filters, { '$set': data }, { returnOriginal: false })
    ).then(result => this.postprocess(result.value))
  }

  static destroy(_id) {
    return this.db.collection(this.collection).deleteOne({ _id: new ObjectId(_id) })
      .then(result => ({ deleted: result.result.n }))
  }


  static endpoints() {
    let endpoints = [
      {
        method: 'GET',
        endpoint: `/${this.collection}`,
        function: req => this.list(req.query, req.query.limit, req.query.page, req.query.sort)
      },
      {
        method: 'POST',
        endpoint: `/${this.collection}`,
        function: req => this.create(req.body)
      },
      {
        method: 'GET',
        endpoint: `/${this.collection}/:id`,
        function: req => this.get(req.params.id)
      },
      {
        method: 'PUT',
        endpoint: `/${this.collection}/:id`,
        function: req => this.update(req.params.id, req.body)
      },
      {
        method: 'DELETE',
        endpoint: `/${this.collection}/:id`,
        function: req => this.destroy(req.params.id)
      }
    ]

    return endpoints
  }

}