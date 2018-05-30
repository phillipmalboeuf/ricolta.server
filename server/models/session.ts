
import { randomPassword, hashPassword } from '../helpers/encryption'
import { ObjectId } from 'mongodb'

import Model from './_model'
import User from './user'

export default class Session extends Model {
  static collection = 'sessions'

  static preprocess(data) {
    return super.preprocess({
      ...data
    })
  }

  static postprocess(data) {
    return super.postprocess({
      ...data
    })
  }

  static endpoints() {
    return [
      {
        method: 'POST',
        endpoint: `/${this.collection}`,
        function: req => this.create(req.body)
      },
      {
        method: 'GET',
        endpoint: `/${this.collection}/:id`,
        function: req => this.get(req.params.id)
      }
    ]
  }

  static create(data) {

    return User.get_where({email: data.email}).then(user => {
      if (user && user.password === hashPassword(data.password, user.salt).password) {
        const secret = randomPassword()
        const hash = hashPassword(secret)

        return super.create({
          secret_hash_salt: hash.salt,
          secret_hash: hash.password,
          user_id: user._id
        }).then(session => ({
          _id: session._id,
          secret: secret,
          user_id: user._id
        }))
      }
        
    })

  }
}