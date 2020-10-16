const command = process.argv[2];

const { ApiPromise, WsProvider } = require('@polkadot/api');
const wsProvider = new WsProvider('wss://rpc.polkadot.io');


async function Block () {
  const api = await ApiPromise.create({provider : wsProvider});
  var reg = /^\d+$/;

  if(command){
    if(command.slice(0,2) == "0x" && command.length == 66){
        const Block = await api.rpc.chain.getBlock(command);
        let header = Block.block.header;   
        console.log(` block ${header.number}: `);
        console.log(`               Block Hash      :   ${command}`);
        console.log(`               Parent Hash     :   ${header.parentHash}`);
        console.log(`               State Root      :   ${header.stateRoot}`);
        console.log(`               Extrinsics Root :   ${header.extrinsicsRoot}`);
        console.log(`               Digest          :   ${header.digest}`);
        console.log("");
        console.log("==============================================================================");
        console.log("");

        process.exit(0);
    }else if (reg.test(command)){

        const hashRaw = await api.rpc.chain.getBlockHash(command);
        const hash = hashRaw.toString();
        const Block = await api.rpc.chain.getBlock(hash);

        let header = Block.block.header;   
        console.log(` block ${header.number}: `);
        console.log(`               Block Hash      :   ${hash}`);
        console.log(`               Parent Hash     :   ${header.parentHash}`);
        console.log(`               State Root      :   ${header.stateRoot}`);
        console.log(`               Extrinsics Root :   ${header.extrinsicsRoot}`);
        console.log(`               Digest          :   ${header.digest}`);
        console.log("");
        console.log("==============================================================================");
        console.log("");

        process.exit(0);
    }else{
        console.log("Available commands are :- ");
        console.log("                        1. node polkapi.js ");
        console.log("                        2. node polkapi.js <blockNumber>");
        console.log("                        3. node polkapi.js <blockHash>"); 
        console.log("----------------Or check if hash is valid---------");
        process.exit(0); 
    }
}
else{

    let count = 0;

    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
      console.log(` block ${header.number}: `);
      console.log(`               Block Hash      :     ${header.hash}`);
      console.log(`               Parent Hash     :     ${header.parentHash}`);
      console.log(`               State Root      :     ${header.stateRoot}`);
      console.log(`               Extrinsics Root :     ${header.extrinsicsRoot}`);
      console.log(`               Digest          :     ${header.digest}`);
      console.log("");
      console.log("==============================================================================");
      console.log("");
  
      if (++count === 256) {
        unsubscribe();
        process.exit(0);
      }
    });
}
}

Block().catch(console.error);