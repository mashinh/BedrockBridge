/**
 * Basic Custom Commands (basicCustomCommands) - BedrockBridge Plugin
 * 
 * This bridge-addon provides some useful ingame additional prefix-commands. This is mainly meant as an example for you to make more!
 * Once you register a command you will be able to visualise it from !help along with the other bridge commands
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */

import { system, Player, EffectTypes, GameMode } from '@minecraft/server';
import { bridge } from '../addons';


const admin_role = "admin";


// You can see the structure: 1) name of command, 2) callback run when the command is used (and you get 
// the player who ran the command, and all parameters already split even with quotes) and 3) description
// which will be visualised when a player runs !help
bridge.bedrockCommands.registerCommand("tp", (user, target)=>{
    if (!user.hasTag(admin_role)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }

    // Now let's do the stuff
    if(target?.readPlayer()) //readPlayer converts the string in a player object with that nametag
        user.teleport(target.readPlayer().location)
    else {
        user.sendMessage("§ctarget player not found")
    }
}, "teleport to the target player location. Usage: tp <username>"); //this is the description which will be visualised in !help


bridge.bedrockCommands.registerCommand("mute", (user, target, time)=>{
    if (!user.hasTag(admin_role)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }

    const target_player = target?.readPlayer();
    if(target_player){
        if (time){
            target_player.mute();
            target_player.sendMessage("§oYou have been muted by an admin.") ;
            
            system.runTimeout(()=>{
                target_player.unmute()
                target_player.sendMessage("§oYou have been unmuted.")    
            }, time.readInteger())
        }
        else { //didn't say the time... so forever ig?
            target_player.mute();
            target_player.sendMessage("§oYou have been muted by an admin.")            
        }
    }
    else { //he didn't say the nametag
        user.sendMessage("§ctarget player not found. Make sure to use a valid nametag when you run this command.");
    }    
}, "mute a target player for a specified amount of time. Usage: tp <username> <time?>");


// Ideated by PoWeROffAPT
bridge.bedrockCommands.registerCommand("heal", (user, target) => {
    if (!user.hasTag(admin_role)) {
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }

    const target_player = target?.readPlayer();
    if (target_player){
        target_player.getEffects().forEach(e=>{
            // removing all effects from the player
            target_player.removeEffect(e.typeId);
        })
        system.run(()=>{
            target_player.getComponent("health").resetToMaxValue();
        })        
        target_player.sendMessage("§aYou have been healed by an admin.");
    } else {
        user.sendMessage("§cTarget player not found. Make sure to use a valid username when you run this command.");
    }
}, "heal a target player. Usage: heal <username>");

// Ideated by PoWeROffAPT
bridge.bedrockCommands.registerCommand("gamemode", async(user, target, mode) => {
    if (!user.hasTag(admin_role)) {
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }

    const target_player = target?.readPlayer();
    if (mode.toString() in GameMode && target_player){
        await target_player.runCommandAsync(`gamemode ${mode} @s`);
        target_player.sendMessage(`§aYour gamemode has been changed to ${mode} by an admin.`);
        user.sendMessage("§eCommand succefully executed.");
    }
    else {
        user.sendMessage("§eMissing parameter. Usage: gamemode <username> <gamemode>");
    }
}, "set gamemode for a target player. Usage: gamemode <username> <gamemode> (e.g. §ogamemode dude12 survival)");