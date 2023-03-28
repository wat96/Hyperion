const _ = require('lodash')
require('dotenv').config()

const etherscanApiKey = process.env.YOUR_ETHERSCAN_API_KEY
const etherscanApi = require('etherscan-api').init(etherscanApiKey)

const getTransactionsForAccount = async (account) => {
    try {
        const history = (await etherscanApi.account.txlist(account)).result

        return history
    } catch (error) {
        console.error(`Failed to fetch transactions: ${error.message}`)
    }
}

const filterTxsForCreate = (history) => {
    return _.filter(history, tx => !!tx.contractAddress)
}
