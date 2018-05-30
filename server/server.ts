const express = require('express')
import { Application, Request, Response, NextFunction } from 'express'
import * as bodyparser from 'body-parser'
const cookieparser = require('cookie-parser')
import createLocaleMiddleware from 'express-locale'

import { CONF } from '../config'


export const server: Application = express()
server.use(cookieparser())
server.use(bodyparser.json())
server.use(createLocaleMiddleware({
  'priority': ['cookie', 'accept-language', 'default'],
  'default': CONF('DEFAULT_LOCALE')
}))

require('./models')

server.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Content-Language', req.locale.language)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Origin', CONF('ORIGIN'))
  next()
})


const port = process.env.PORT || 8089
server.listen(port, () => {
  console.log(`Listening on port ${port}...`)
});