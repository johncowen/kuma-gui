import { RestClient } from './RestClient'
import type Env from '@/app/application/services/env/Env'

export class Api {
  constructor(
    public client: RestClient,
    protected env: Env['var'],
  ) { }

  get baseUrl() {
    return this.client.baseUrl
  }
}
