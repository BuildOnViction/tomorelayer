export const IS_DEV = process.env.NODE_ENV !== 'production'

export const TOMO_COIN_TYPE = 889

export const SITE_MAP = {
    Authentication: '/login',
    Home: '/',
    Profile: '/profile',
    Orders: '/orders',
    Relayers: '/relayers',
    Register: '/register',
    Dashboard: '/dashboard',
    Logout: '/logout',
    ListRelayer: '/list-relayer'
}

export const UNLOCK_WALLET_METHODS = {
    TomoWallet: 'Tomo Wallet',
    LedgerWallet: 'Ledger Wallet',
    TrezorWallet: 'Trezor Wallet',
    BrowserWallet: 'MetaMask',
    SoftwareWalletPrivate: 'Private Key',
    SoftwareWalletMnemonic: 'Mnemonic',
}

export const MISC = {
    MinimumDeposit: 25000,
    AuthMessage: process.env.REACT_APP_SIGNATURE_MESSAGE,
}

export const I18N_LANGS = [{ value: 'en', label: 'EN' }, { value: 'vn', label: 'VN' }, { value: 'jp', label: 'JP' }]

export const STORAGE_ITEMS = {
    user: '__tomorelayer__user__',
}

export const STANDARD_ERC20_ABI = [{
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{
            name: '',
            type: 'string',
        }, ],
        payable: false,
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{
            name: '',
            type: 'uint256',
        }, ],
        payable: false,
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{
            name: '',
            type: 'uint8',
        }, ],
        payable: false,
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{
            name: '',
            type: 'string',
        }, ],
        payable: false,
        type: 'function',
    },
]