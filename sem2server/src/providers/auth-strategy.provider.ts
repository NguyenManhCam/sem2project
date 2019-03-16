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
            case 'Basic':
                return new BasicStrategy(this.verifyBasicStrategy.bind(this));

            case 'Bearer':
                return new BearerStrategy(this.verifyBearerStrategy.bind(this));

            default:
                return Promise.reject(`The strategy ${name} is not available.`);
        }
    }

    async verifyBasicStrategy(
        username: string,
        password: string,
        cb: (err: Error | null, user?: User | false) => void,
    ) {
        const user = await this.userRepository.findOne({ where: { email: username } });
        if (user && user.checkPassword(password)) {
            cb(null, user)
        } else {
            cb(null, false);
        }
    }

    async verifyBearerStrategy(
        token: string,
        cb: (err: Error | null, user?: User | false) => void,
    ) {
        try {
            const decoded = await jwt.verify(token, 'secret');
            const obj = JSON.parse(JSON.stringify(decoded));
            const user = await this.userRepository.findById(obj.id);
            if (user && obj.password === user.password) {
                cb(null, user)
            } else {
                cb(null, false);
            }
        } catch (error) {
            console.log(error);
            cb(null, false);
        }
    }
}
