import {
  ERROR_MESSAGE_CONTRACT_NO_ADDRESS as NO_ADDRESS,
  CONTRACTS_ENDPOINT as ENDPOINT
} from './constants'
import {is, get} from './utils'

class Contract {
  constructor(web3data) {
    this.web3data = web3data
  }

  getDetails(hash, filterOptions) {
    if (is.notHash(hash)) return Promise.reject(new Error(NO_ADDRESS))
    return get(this.web3data, {pathParam: hash, endpoint: ENDPOINT, filterOptions})
  }

  getFunctions(hash, filterOptions) {
    if (is.notHash(hash)) return Promise.reject(new Error(NO_ADDRESS))
    return get(this.web3data, {
      pathParam: hash,
      endpoint: ENDPOINT,
      subendpoint: 'functions',
      filterOptions
    })
  }

  getAudit(hash, filterOptions) {
    if (is.notHash(hash)) return Promise.reject(new Error(NO_ADDRESS))
    return get(this.web3data, {
      pathParam: hash,
      endpoint: ENDPOINT,
      subendpoint: 'audit',
      filterOptions
    })
  }

  getAbi(hash, filterOptions) {
    if (is.notHash(hash)) return Promise.reject(new Error(NO_ADDRESS))
    return get(this.web3data, {
      pathParam: hash,
      endpoint: ENDPOINT,
      subendpoint: 'abi',
      filterOptions
    })
  }

  getSourceCode(hash, filterOptions) {
    if (is.notHash(hash)) return Promise.reject(new Error(NO_ADDRESS))
    return get(this.web3data, {
      pathParam: hash,
      endpoint: ENDPOINT,
      subendpoint: 'source-code',
      filterOptions
    })
  }

  async getCode(hash) {
    const response = await this.getDetails(hash);
    return new Promise(
        (resolve, reject) => {
          if (is.null(response) || is.undefined(response) || response.status !== 200) {
            reject('/contracts/:hash failed to respond')
          } else if (!response.payload) {
            reject('/contracts/:hash failed to respond with payload')
          } else {
            if (response.payload.bytecode) {
              resolve(response.payload.bytecode)
            } else {
              // TODO: Eval is this the correct response for no contract byte code?
              resolve(false) // other options null, {}, ''
            }
          }
        })
  }
}

export default Contract
