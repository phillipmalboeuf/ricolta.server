import * as crypto from 'crypto'

import { Request, Response } from 'express'
import { MongoClient } from 'mongodb'
import { CONF } from '../../config'

import { server } from '../server'

import User from './user'
import Session from './session'
import Piece from './piece'

MongoClient.connect(CONF('MONGO_URI')).then(client => {
  const db = client.db(CONF('MONGO_DB'))
  const models = [
    User,
    Session,
    Piece
  ]

  models.forEach(model => {
    model.db = db
    model.endpoints().forEach(endpoint => server[endpoint.method.toLowerCase()](
      endpoint.endpoint,
      (req: Request, res: Response) => endpoint.function(req).then((response: Response) => res.json(response))
    ))
  })
})