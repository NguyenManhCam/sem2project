import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import {
    AuthenticationBindings,
    AuthenticationMetadata,
} from '@loopback/authentication';
import { BasicStrategy } from 'passport-http';
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { repository } from '@loopback/repository';
import { UserRepository } from '../repositories';
import * as jwt from 'jsonwebtoken';
import { User } from '../models';

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
    constructor(
        @inject(AuthenticationBindings.METADATA) private metadata: AuthenticationMetadata,
        @repository(UserRepository) protected userRepository: UserRepository,
    ) { }

    value(): ValueOrPromise<Strategy | undefined> {
        // The function was not decorated, so we shouldn't attempt authentication
        if (!this.metadata) {
            return undefined;
        }

        const name = this.metadata.strategy;
        switch (name) {
            case 'BasicStrategy':
                return new BasicStrategy(this.verify);

            case 'BearerStrategy':
                return new BearerStrategy(this.verify2);

            default:
                return Promise.reject(`The strategy ${name} is not available.`);
        }
    }

    async verify(
        username: string,
        password: string,
        cb: (err: Error | null, user?: User | false) => void,
    ) {
        await this.userRepository.findOne({ where: {} })
        // find user by name & password
        // call cb(null, false) when user not found
        // call cb(null, user) when user is authenticated
    }

    async verify2(
        token: string,
        cb: (err: Error | null, user?: User | false) => void,
    ) {
        await this.userRepository.findOne({ where: {} })
        // find user by name & password
        // call cb(null, false) when user not found
        // call cb(null, user) when user is authenticated
    }
}