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