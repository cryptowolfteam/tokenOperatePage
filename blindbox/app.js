import {
  factory_abi, box_abi
} from "./abi.js";

export const getPlanLength = async(factory) => {
  return (await factory.getPlanLength()).toString()
}

export const checkBusinessPlan = async(planIndex, factory) => {
  let plan  = await factory.plans(planIndex);
  return {
    slotSize: plan.slotSize.toString(),
    pricePerSolt: plan.pricePerSolt.toString(),
    buildLimit: plan.buildLimit.toString(),
    alreadyBuilt: plan.alreadyBuilt.toString()
  }
}

export const buildByPlan = async(planIndex, factory, boxPrice, signer) => {
  return factory.connect(signer).buildByPlan(planIndex, boxPrice)
}

export const checkAllMyBoxMachine = async(factory, account) => {
  let log_machine_create = await (async () => {
    let filter = factory.filters.BoxMachineCreate(account)
    let abi = ["event BoxMachineCreate(address indexed Owner, address indexed BoxMachine, uint256 SlotSize)"]
    let iface = new ethers.utils.Interface(abi);
    let logs = await factory.queryFilter(filter)
    let decodedEvents = logs.map(log => iface.parseLog(log));
    return decodedEvents
  })()

  return log_machine_create.map(x=>{
    let args = x.args
    return args.BoxMachine
  })
}

export const getStockNumberAndPrice = async (box) => {
  return {
    stock: (await box.getStockNumber()).toString(),
    price: (await box.boxPrice()).toString()
  }
}

export const showAllStock = async (box) => {
  let data =  await box.showAllStock()
  let adds = data.addresses
  let ids = data.tokenIds
  let temp = []
    for(let i=0; i< adds.length; i++){
      temp.push([adds[i],(ids[[i]]).toString()])
    }
    return temp
}

export const drawBox = async (times, box, to, signer) => {
  return box.connect(signer).drawBox(times, to)
}

export const addListenerDrawResultOnce = (box, account, provider) => {
  let filter = box.filters.DrawBlindBox(account)
  provider.once(filter, (log)=>{
    let abi = ["event DrawBlindBox(address indexed Receiver, address[] ERC721Addresses, uint[] TokenIds)"]
    let iface = new ethers.utils.Interface(abi);
    let decodedEvents = iface.parseLog(log);
    console.log(decodedEvents)
  })
}

export const getReceiveHistory = async (box, account) => {
  let log_draw_box = await (async () => {
    let filter = box.filters.DrawBlindBox(account)
    let abi = ["event DrawBlindBox(address indexed Receiver, address[] ERC721Addresses, uint[] TokenIds)"]
    let iface = new ethers.utils.Interface(abi);
    let logs = await box.queryFilter(filter)
    console.log(logs)
    let decodedEvents = logs.map(log => iface.parseLog(log));
    return decodedEvents
  })()

  return log_draw_box.map(x=>{
    let adds = x.args.ERC721Addresses
    let ids = x.args.TokenIds
    let temp = []
    for(let i=0; i< adds.length; i++){
      temp.push([adds[i],(ids[[i]]).toString()])
    }
    return temp
  })
}




//bind---------------------------------------------------
$("#query_plan_number").click(async ()=> {
  let factory_address = $("#check_number_factory").val()
  let factory = new ethers.Contract(factory_address, factory_abi, window.provider)
  let number = await getPlanLength(factory)
  $("#plan_number").html(number)
})

$("#query_plan").click(async ()=> {
  let factory_address = $("#check_plan_factory").val()
  let plan_number = $("#check_plan_number").val()
  let factory = new ethers.Contract(factory_address, factory_abi, window.provider)
  let result = await checkBusinessPlan(plan_number, factory)
  $("#show_plan").val(JSON.stringify(result))
})

$("#query_box").click(async ()=> {
  let factory_address = $("#check_box_factory").val()
  let box_owner = $("#check_box_owner").val()
  if(box_owner==""){
    box_owner = null
  }
  let factory = new ethers.Contract(factory_address, factory_abi, window.provider)
  let result = await checkAllMyBoxMachine(factory, box_owner)
  console.log(result)
  $("#show_box").val(result)
})

$("#query_box_info").click(async ()=>{
  let box_address = $("#get_info_box").val()
  let box = new ethers.Contract(box_address, box_abi, window.provider)
  let result = await getStockNumberAndPrice(box)
  $("#stock_number").html(result.stock)
  $("#price").html(result.price)
})

$("#show_all_query").click(async ()=>{
  let box_address = $("#show_all_stock_box").val()
  let box = new ethers.Contract(box_address, box_abi, window.provider)
  let result = await showAllStock(box)
  let txt = ""
  for(let e of result){
    txt += "address : " + e[0] + " token id: " + e[1] + "\n"
  }
  $("#show_all_stock").val(txt)
})

$("#draw").click(async ()=> {
  let box_address = $("#draw_box_address").val()
  let times = $("#draw_box_times").val()
  let to = $("#draw_box_to").val()
  let box = new ethers.Contract(box_address, box_abi, window.provider)
  //add listener to drawBox
  addListenerDrawResultOnce(box, window.Address, provider)
  console.log("listen added once")
  await drawBox(times, box, to, window.me)
})