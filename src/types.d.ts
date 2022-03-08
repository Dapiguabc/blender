declare module "*.scss"

declare module "lamden_wallet_controller"

declare type Token = "currency" | "phi"

declare interface IContract {
    [key: number]: string
}
declare type IContracts = Record<Token, IContract>

declare type TokenMeta = {
    contract: string
    symbol: string | Token
}