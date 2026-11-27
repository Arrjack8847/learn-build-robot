// Direct terminal input, independent of readline's hidden/muted output rendering.
// Bash reads the inherited TTY. Only the captured pipe contains the answer;
// never pass a PIN or OTP in argv or print it. Fail closed on EOF or interruption.
import {execFileSync} from "node:child_process";
export function readTerminalAnswer(prompt,{hidden=false,execute=execFileSync,tty=process.stdin.isTTY}={}){
 if(!tty||typeof prompt!=="string"||!prompt||typeof hidden!=="boolean")throw Error("INTERACTIVE_TERMINAL_REQUIRED");
 const script='if [ "$2" = hidden ]; then IFS= read -r -s -p "$1" answer || exit 1; printf "\\n" >&2; else IFS= read -r -p "$1" answer || exit 1; fi; printf "%s" "$answer"';
 try{return execute("bash",["-c",script,"combined-prompt",prompt,hidden?"hidden":"visible"],{encoding:"utf8",stdio:["inherit","pipe","inherit"],maxBuffer:4096});}catch{throw Error("TERMINAL_INPUT_UNCONFIRMED");}
}
