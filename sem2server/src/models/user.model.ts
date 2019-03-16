import { Entity, model, property } from '@loopback/repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'object',
  })
  profile?: object;


  constructor(data?: Partial<User>) {
    super(data);
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async generateToken() {
    return await jwt.sign({ id: this.id, email: this.email, password: this.password }, 'secret', { expiresIn: '2 days' });
  }

}
