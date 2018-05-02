'use strict';

const util = require('../lib/utils/util');
const consensus = require('../lib/protocol/consensus');
const encoding = require('../lib/utils/encoding');
const TX = require('../lib/primitives/tx');
const Block = require('../lib/primitives/block');
const Script = require('../lib/script/script');

function createGenesisBlock(options) {
  let flags = options.flags;
  let key = options.key;
  let reward = options.reward;

  if (!flags) {
    flags = Buffer.from(
      'He is rendering pasta since 03/Apr/2018.',
      'ascii');
  }

  if (!key) {
    key = Buffer.from(''
      + '04678afdb0fe5548271967f1a67130b7105cd6a828e039'
      + '09a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c3'
      + '84df7ba0b8d578a4c702b6bf11d5f', 'hex');
  }

  if (!reward)
    reward = 50 * consensus.COIN;

  const tx = new TX({
    version: 1,
    inputs: [{
      prevout: {
        hash: encoding.NULL_HASH,
        index: 0xffffffff
      },
      script: Script()
        .pushInt(503382015)
        .pushPush(Buffer.from([4]))
        .pushData(flags)
        .compile(),
      sequence: 0xffffffff
    }],
    outputs: [{
      value: reward,
      script: Script.fromPubkey(key)
    }],
    locktime: 0
  });

  tx.inputs[0].script = script.fromRaw(Buffer.from('48652069732072656e646572696e672070617374612'
                                                   + '073696e63652030332f4170722f323031382e','hex'));
    
  const block = new Block({
    version: options.version,
    prevBlock: encoding.NULL_HASH,
    merkleRoot: tx.hash('hex'),
    time: options.time,
    bits: options.bits,
    nonce: options.nonce,
    height: 0
  });

  block.txs.push(tx);

  return block;
}

const main = createGenesisBlock({
  version: 1,
  time: 1522681200,
  bits: 503382015,
  nonce: 4454047,
  flags: new Buffer(
    'He is rendering pasta since 03/Apr/2018.','ascii'),
  script: Script.fromArray([
      new Buffer('a8afa48c98f70c3ccbc173fcdd49b6c62e240326','hex'),
      opcodes.OP_CHECKSIG
  ])
});

const testnet = createGenesisBlock({
  version: 1,
  time: 1522681200,
  bits: 503382015,
  nonce: 5990674,
  flags: new Buffer(
    'He is rendering pasta since 03/Apr/2018.','ascii'),
  script: Script.fromArray([
      new Buffer('a8afa48c98f70c3ccbc173fcdd49b6c62e240326','hex'),
      opcodes.OP_CHECKSIG
  ])
});

const regtest = createGenesisBlock({
  version: 1,
  time: 1522681200,
  bits: 545259519,
  nonce: 77361
});

util.log(main);
util.log('');
util.log(testnet);
util.log('');
util.log(regtest);
util.log('');
util.log('main hash: %s', main.rhash());
util.log('main raw: %s', main.toRaw().toString('hex'));
util.log('');
util.log('testnet hash: %s', testnet.rhash());
util.log('testnet raw: %s', testnet.toRaw().toString('hex'));
util.log('');
util.log('regtest hash: %s', regtest.rhash());
util.log('regtest raw: %s', regtest.toRaw().toString('hex'));
