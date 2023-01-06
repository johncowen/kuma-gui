import prodContainer, { TOKENS as PROD_TOKENS } from './container.prod'
import devContainer, { TOKENS as DEV_TOKENS } from './container.dev'
export default false ? prodContainer : devContainer
export const TOKENS = false ? PROD_TOKENS : DEV_TOKENS
