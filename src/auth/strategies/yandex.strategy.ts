import {
    Injectable,
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
  import { PassportStrategy } from '@nestjs/passport';
  import {Strategy} from 'passport-yandex'
  import { YandexUser } from 'src/interfaces/auth.interfaces';
  import { StrategiesEnum } from '../constants/strategies.constants';
  
  @Injectable()
  export class YandexStrategy extends PassportStrategy(
    Strategy,
    StrategiesEnum.Yandex,
  ) {
    constructor() {
      super({
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: process.env.YANDEX_REDIRECT_URL,
   
      });
    }
  
    async validate(
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ): Promise<any> {
      try {
        const { name, emails, photos } = profile;
        const user: YandexUser = {
          email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
          picture: photos[0].value,
          accessToken,
          refreshToken,
        };
        done(null, user);
      } catch (error) {
        Logger.error(error);
        const internalError = new InternalServerErrorException();
        done(internalError);
        throw internalError;
      }
    }
  }