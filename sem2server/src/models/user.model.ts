import {Entity, model, property} from '@loopback/repository';
import * as bcrypt from 'bcrypt';

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
  private password: string;

  @property({
    type: 'object',
  })
  data?: object;


  constructor(data?: Partial<User>) {
    super(data);
  }

  
  public async setPassword(password : string) {
    this.password = await bcrypt.hash(password, 10);
  }

  public async checkPassword(password: string) : Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
  
  
}
