
import * as crypto from 'crypto'


export const randomPassword = ()=> {
  return crypto.randomBytes(12).toString('hex')
}

export const hashPassword = (password, salt = undefined)=> {
  const _salt = salt ? salt : randomPassword()
  const hash = crypto.createHmac('sha256', _salt)
  hash.update(password)

  return {
    salt: _salt,
    password: hash.digest('hex')
  }
}

export const encrypt = (text: string, password: string)=> {
  let cipher = crypto.createCipher('aes-256-ctr', password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export const decrypt = (encrypted_text: string, password: string)=> {
  let decipher = crypto.createDecipher('aes-256-ctr', password)
  let decrypted = decipher.update(encrypted_text, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}