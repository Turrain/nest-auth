import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategiesEnum } from '../constants/strategies.constants';

@Injectable()
export class YandexOAuthGuard extends AuthGuard(StrategiesEnum.Yandex) {}