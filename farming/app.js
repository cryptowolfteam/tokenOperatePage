import {
  erc20_abi
} from "./abi.js";



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