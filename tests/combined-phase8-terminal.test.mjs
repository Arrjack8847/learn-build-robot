import test from "node:test";
import assert from "node:assert/strict";
import {readTerminalAnswer} from "../scripts/combined/terminal-input.mjs";
test("terminal confirmation stays visible while sensitive input uses hidden TTY read",()=>{
 for(const hidden of [false,true]){
  const answer=hidden?"739281":"YES";
  assert.equal(readTerminalAnswer("Test prompt: ",{hidden,tty:true,execute:(file,args,options)=>{
   assert.equal(file,"bash");assert.equal(args.at(-1),hidden?"hidden":"visible");
   assert.ok(args[1].includes('read -r -s -p "$1"'));
   assert.deepEqual(options.stdio,["inherit","pipe","inherit"]);
   assert.ok(!JSON.stringify(args).includes(answer)||!hidden);
   return answer;
  }}),answer);
 }
});
test("terminal input refuses noninteractive input and sanitizes subprocess errors",()=>{
 assert.throws(()=>readTerminalAnswer("Prompt",{tty:false}),/INTERACTIVE_TERMINAL_REQUIRED/);
 assert.throws(()=>readTerminalAnswer("Prompt",{tty:true,execute:()=>{throw Error("sensitive-output");}}),/^Error: TERMINAL_INPUT_UNCONFIRMED$/);
});
