import {
  free_create_abi, market_abi} from "./abi.js";



export const addListenerListPriceOnce = (market, account, provider) => {
    let filter = market.filters.ListPrice(null, account)
    provider.once(filter, (log)=>{
      let abi = ["event ListPrice(uint256 indexed orderId,address indexed operator,address NFTContract,uint256 tokenId,address targetToken,uint256 price)"]
      let iface = new ethers.utils.Interface(abi);
      let decodedEvents = iface.parseLog(log);
      console.log(decodedEvents)
    })
}


export const mintThenAddSellOrder = async (free_create, URI, targetTokenAddress, price, signer) => {
  return await free_create.connect(signer).mintThenAddSellOrder(URI, targetTokenAddress, price)
}

export const changePrice = async (market, orderId, targetTokenAddress, price, signer) => {
  return await market.connect(signer).changePrice(orderId, targetTokenAddress, price)
}

export const withdraw = async (market, orderId, signer) => {
  return await market.connect(signer).withdraw(orderId)
}

export const showOrderInfo = async (market, orderId) => {
  let info = await Promise.all([
    market.ownerOf(orderId),
    market.orders(orderId)
  ])

  return {
    owner: info[0],
    NFTContract: info[1][0],
    NFTTokenId: info[1][1].toString(),
    targetToken: info[1][2],
    price: info[1][3].toString()
  }
}

export const buyFromOrder = async (market, orderId, signer) => {
  return await market.connect(signer).buyFromOrder(orderId)
}

export const buyFromOrderWithValue = async (market, orderId, value, signer) => {
  return await market.connect(signer).buyFromOrder(orderId, {value:value})
}


//bind----------------------------------------------
$("#mint").click(async () =>{
  let free_create_address = $("#put_market_nft").val()
  let URI = $("#put_market_URI").val()
  let token = $("#put_market_token").val()
  let price = $("#put_market_price").val()
  let free_create = new ethers.Contract(free_create_address, free_create_abi, window.provider)
  await mintThenAddSellOrder(free_create, URI, token, price, window.me)
})

$("#query").click(async ()=> {
  let market_address = $("#check_info_market").val()
  let order_id = $("#check_info_orderId").val()
  let market = new ethers.Contract(market_address, market_abi, window.provider)
  let info = await showOrderInfo(market, order_id)
  $("#info_owner").html(info.owner)
  $("#info_nft_address").html(info.NFTContract)
  $("#info_token_id").html(info.NFTTokenId)
  $("#info_target_token").html(info.targetToken)
  $("#info_price").html(info.price)
})

$("#change").click(async ()=> {
  let market_address = $("#change_price_market").val()
  let order_id = $("#change_price_order").val()
  let token = $ ("#change_price_token").val()
  let price = $("#change_price_price").val()
  let market = new ethers.Contract(market_address, market_abi, window.provider)
  await changePrice(market,order_id, token, price, window.me)
})

$("#withdraw").click(async ()=> {
  let market_address = $("#withdraw_market").val()
  let order_id = $("#withdraw_order").val()
  let market = new ethers.Contract(market_address, market_abi, window.provider)
  await withdraw(market, order_id, window.me)
})

