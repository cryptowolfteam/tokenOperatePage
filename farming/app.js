import {
  master_chef_abi
} from "./abi.js";



export const checkPoolLength = async (master_chef)=>{
  return (await master_chef.poolLength()).toString()
}

export const checkPoolInfo = async (master_chef, number) => {
  let result = await master_chef.poolInfo(number)
  return {
    lpToken : result[0],
    allocPoint : result[1].toString(),
    lastRewardBlock : result[2].toString(),
    accMulanV2PerShare : result[3].toString()
  }
}

export const checkDeposit = async (master_chef, pool_number, user_address) => {
  let result = await master_chef.userInfo(pool_number, user_address)
  return result[0].toString()
}

export const pendingMulanV2 = async (master_chef, pool_number, user_address) => {
   return (await master_chef.pendingMulanV2(pool_number, user_address)).toString()
}

export const deposit = async (master_chef, pool_number, amount, signer) => {
  await master_chef.connect(signer).deposit(pool_number, amount)
}

export const withdraw = async (master_chef, pool_number, amount, signer) => {
  await master_chef.connect(signer).withdraw(pool_number, amount)
}

//bind----------------------------------------------

$("#query_length").click(async ()=>{
  let chef_address = $("#get_length_pool").val()
  let chef = new ethers.Contract(chef_address, master_chef_abi, window.provider)
  let length = await checkPoolLength(chef)
  $("#pool_length").html(length)
})

$("#check_pool_info").click(async ()=> {
  let chef_address = $("#check_info_chef").val()
  let pool_number = $("#pool_number").val()
  let chef = new ethers.Contract(chef_address, master_chef_abi, window.provider)
  let result = await checkPoolInfo(chef, pool_number)
  $("#info_lp").html(result.lpToken)
  $("#info_alloc").html(result.allocPoint)
  $("#reward_block").html(result.lastRewardBlock)
  $("#accShare").html(result.accMulanV2PerShare)
})

$("#query_amount").click(async ()=> {
  let chef_address = $("#amount_chef").val()
  let pool_number = $("#amount_pool_id").val()
  let user_address = $("#amount_user").val()
  let chef = new ethers.Contract(chef_address, master_chef_abi, window.provider)
  let amount = await checkDeposit(chef, pool_number, user_address)
  $("#deposit_amount").html(amount)
})

$("#query_pending").click(async ()=> {
  let chef_address = $("#pending_chef").val()
  let pool_number = $("#pending_pool_number").val()
  let user = $("#pending_pool_user").val()
  let chef = new ethers.Contract(chef_address, master_chef_abi, window.provider)
  let pending  = await pendingMulanV2(chef, pool_number, user)
  $("#pending_reward").html(pending)
})

$("#deposit_lp").click(async ()=> {
  let chef_address = $("#deposit_chef").val()
  let pool_number = $("#deposit_pool_number").val()
  let amount = $("#deposit_input").val()
  let chef = new ethers.Contract(chef_address, master_chef_abi, window.provider)
  await deposit(chef, pool_number, amount, window.me)
})

$("#withdraw_lp").click(async ()=> {
  let chef_address = $("#withdraw_chef").val()
  let pool_number = $("#withdraw_pool_number").val()
  let amount = $("#withdraw_amount").val()
  let chef = new ethers.Contract(chef_address, master_chef_abi, window.provider)
  await withdraw(chef, pool_number, amount, window.me)
})