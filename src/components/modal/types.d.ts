interface IModal {
    cref?: React.MutableRefObject<{close: () => void}>
    show?: boolean
    children?: React.ReactChild
    style?: React.CSSProperties 
    onChange?: (show: boolean | undefined) => void
    onClose?: () => void
}

interface IDepositModal extends IModal {
    account: string
    amount: number
    token: TokenMeta
    depositContract: string
}

interface IWithdrawModal extends IModal {
    note: string
    to: string
    relayer: string
}