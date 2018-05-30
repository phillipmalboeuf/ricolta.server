
import { hashPassword, encrypt, decrypt } from '../helpers/encryption'
import { ObjectId } from 'mongodb'

import Model from './_model'

export default class User extends Model {
  static collection = 'users'

  static preprocess(data) {
    return super.preprocess({
      ...data,
      ...(data.password
      ? hashPassword(data.password)
      : {})
    })
  }

  static postprocess(data) {
    return super.postprocess({
      ...data
    })
  }


  static endpoints() {
    return [
      ...super.endpoints()
    ]
  }
}