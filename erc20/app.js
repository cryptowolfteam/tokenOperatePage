import {
  erc20_abi
} from "./abi.js";

export const balanceOf = async (token_address, user_address, provider) => {
  let token = new ethers.Contract(token_address, erc20_abi, provider)
  return (await token.balanceOf(user_address)).toString()
}

export const allowance = async (token, owner_address, spender_address) => {
  return (await token.allowance(owner_address, spender_address)).toString()
}

window.balanceOf = balanceOf

export const tokenInfo = async (token_address, provider) => {
  let token = new ethers.Contract(token_address, erc20_abi, provider)
  let result = await Promise.all([
    token.symbol(),
    token.decimals()
  ])
  return [
    result[0],
    result[1].toString()
  ]
}

window.tokenInfo = tokenInfo

const max =  "115792089237316195423570985008687907853269984665640564039457584007913129639935"

export const approve = async (token_address, target_address, provider, signer) => {
  let token = new ethers.Contract(token_address, erc20_abi, provider)
  await token.connect(signer).approve(target_address, max)
}

export const transfer = async (token_address, to, amount ,provider, signer) => {
  let token = new ethers.Contract(token_address, erc20_abi, provider)
  await token.connect(signer).transfer(to, amount)
}

window.approve = approve

//bind----------------------------------------------
$("#query_balance").click(async ()=>{
  let token_address = $("#check_balance_token").val()
  let account = $("#check_balance_account").val()
  let balance = await balanceOf(token_address, account, window.provider)
  let info = await tokenInfo(token_address, window.provider)
  $("#amount").html(balance / 10**info[1])
  $("#decimal").html(info[1])
  $("#symbol").html(info[0])
})

$("#approve").click(async ()=>{
  let token_address = $("#approve_token").val()
  let target_address = $("#approve_account").val()
  await approve(token_address, target_address, window.provider, window.me)
})

$("#transfer").click(async ()=>{
  let token_address = $("#transfer_token").val()
  let to_address = $("#transfer_to").val()
  let amount = $("#transfer_amount").val()
  await transfer(token_address, to_address, amount, window.provider, window.me)
})

$("#check_allowance").click( async ()=>{
  let token_address = $("#check_allowance_token").val()
  let owner = $("#check_allowance_owner").val()
  let spender = $("#check_allowance_spender").val()
  let token = new ethers.Contract(token_address, erc20_abi, provider)
  let allowance_amount = (await token.allowance(owner, spender)).toString()
  console.log(allowance_amount)
  $("#allowance_amount").html(allowance_amount)
})