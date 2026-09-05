// ============================================================
// KNIGHTS & KNAVES
// SHARED SKILL AND MODIFICATION DESCRIPTIONS
// ============================================================

(function () {

    "use strict";

    window.KKSkillDescriptions = Object.freeze({

        aware:
            "You gain a bonus to your Awareness rolls based on your rank in this skill.",

        flexible:
            "Increase your Mobility by 1, to a maximum of 5. You may only take this skill once.",

        resilient:
            "Increase your Fortitude by 1, to a maximum of 3. You may only take this skill once.",

        sneaky:
            "Increase your Stealth by 1, to a maximum of 5.",

        strong:
            "Increase your Might by 1, to a maximum of 3. You may only take this skill once.",

        tireless:
            "Increase your Endurance by 1, to a maximum of 10.",

        tough:
            "Increase your base Padding by 1, to a maximum of 3. You may only take this skill once.",

        abrazare:
            "Increase your Grappling by 1. You can perform a joint break on an opponent you’re grappled with. To do so, make a melee attack to contest Grappling. If you win, your opponent receives an arm wound of your choice. If you win by 5 or more, you may have your opponent receive a leg wound instead.",

        disarm:
            "Whenever you injure an opponent’s arm, they drop whatever weapon they’re wielding with that arm at a distance equal to their base Reach.",

        "dual-wielding":
            "You can wield two weapons that lack a two-handed bonus or requirement at the same time. If you declare a melee attack, you can make a strike with both weapons on your action’s resolution. You can also draw or stow two objects at once.",

        executioner:
            "You gain a bonus to your Injury Location rolls based on your rank in this skill.",

        feint:
            "If your opponent successfully defends your strike, contest Stealth against their Awareness. On a success, that part of their defense fails. You may only attempt this once per strike.",

        gambit:
            "Before an opponent within your field of vision rolls for damage, you may choose to forgo your defense. If you do, that opponent cannot defend against your next attack this turn.",

        lunge:
            "Your thrusts have 1 additional Reach. This skill also applies when contesting Reach with weapons you wield that can thrust.",

        opportunist:
            "If an opponent within your Reach moves while you are beyond their Vision, you may immediately resolve your action if it is a melee attack made against that opponent.",

        pickpocket:
            "You can draw another combatant’s stowed sidearm if they are within your base Reach. You must take a special action to contest Stealth against your opponent’s Awareness in order to do so.",

        rabat:
            "You can attempt to parry with a one-handed, non-sword weapon that you have not used to attack this turn. It has a Parry of 0 for this purpose. If you successfully parry this way, you may not make an attack with that weapon this turn.",

        sweep:
            "Instead of striking, you may choose to sweep your opponent’s legs before you roll for damage. If the damage exceeds your opponent’s Weight, they roll Mobility with a penalty equal to their Weight minus their Base Weight. If you are shorter than your opponent, reduce the total further by the difference in your Grapple bonus. If the result is 0 or less, your opponent falls Prone.",

        unarmored:
            "If you aren’t wearing any armor, increase your Mobility and your Movement by 5.",

        yank:
            "You can attempt to grapple an opponent whose armor, weapon, or shield is stuck to your weapon.",

        "hold-the-line":
            "If an opponent attempts to move past the maximum Reach of your shield, you may choose to contest Might. If you win, your opponent cannot move past your shield’s maximum Reach this turn.",

        "shield-bash":
            "You can bash with your shield on your turn. Your opponent has advantage on dodging this strike, but cannot parry it. The bash deals d4 damage (plus your Might as usual) but cannot cause a wound. Increase your Fatigue equal to the shield’s weight before rolling for damage. You cannot block with the shield this turn after making the strike.",

        swashbuckling:
            "You can stow your buckler with your sidearm. However, whenever you attack and are attacked, roll a d10. On a 1, the buckler falls to the ground.",

        assassin:
            "Strikes you make with daggers and shortswords ignore padding and cause bleeding when they inflict an injury.",

        "half-swording":
            "Within half of the weapon’s maximum Reach, you gain a d8 bonus to thrusts made with a two-handed sword.",

        mordschlag:
            "Within half of the weapon’s maximum Reach, you can bash with a two-handed sword. This strike deals damage equal to its Two-Handed die or, if it is required, a d10.",

        moulinet:
            "Using a two-handed sword, you can keep your enemies at bay all around you. You can make attacks and defenses, and contest Reach with the weapon outside of your normal Range and Vision. Additionally, if an opponent successfully dodges your strike, you can immediately make another one against a different opponent within your Reach. Each action made outside of your normal capabilities this way increases your Fatigue by the weapon’s Weight.",

        riposte:
            "After successfully parrying an attack, your next attack with the defending weapon against the attacker gains a d4 bonus to its damage and cannot be defended by the parried weapon this turn.",

        "sword-and-board":
            "If you are simultaneously wielding a shield and a sword upon your defense against a creature in front of you, you may combine your Block and Parry into one defense, adding both values a single roll which is made with advantage.",

        "grappling-hook":
            "Instead of striking, you can attempt to grapple an opponent with a weapon that can hook. Your Grappling roll gains a bonus equal to the weapon’s Hook.",

        "haft-hack":
            "You can attempt to block a polearm with a weapon that can chop if you have not used it to attack this turn. If you succeed, the polearm is destroyed and you may not make an attack with that weapon this turn. The weapon has a Block of 0 for this purpose.",

        "weapon-hook":
            "When you attempt a hook, you can target a non-sword weapon to rip from your opponent’s grasp. You must hit 20 on a d20, modified by your Mobility plus the weight of your opponent’s weapon. Then contest Grappling. You gain a bonus equal to your weapon’s Hook, while your opponent gains advantage if they are wielding their weapon with two hands. If you win both contests, your opponent’s weapon is dropped, landing equidistantly between you and your opponent.",

        "haft-block":
            "You can attempt to block a bash, chop, punch, or slash with a two-handed, non-sword weapon. For this purpose, the weapon has a minimum Reach of 2 and a Block equal to its Weight. If you block a chop with your weapon this way, it is destroyed. If you take an injury from blocking this way, you may choose which arm is injured.",

        "haft-strike":
            "If an opponent attempts to move past the minimum Reach of your two-handed polearm or your axe, bludgeon, or flail that has a two-handed requirement, you may choose to contest Might. If you win, your opponent cannot move past your weapon’s minimum Reach this turn.",

        ensnare:
            "If your opponent contests Reach with a weapon that can hook, chop, or catch, you can attempt to snatch the weapon with your flail. You must hit 20 on a d20, modified by the flail’s Wrap. Then contest Grappling. Your opponent gains advantage if they are wielding the weapon with two hands. If you win both contests, the weapon is dropped, landing equidistantly between you and your opponent. However, if you are wielding a chain flail, both weapons become stuck to each other and cannot be separated.",

        "center-grip":
            "Apply to a non-buckler shield. The shield’s maximum Reach increases by 1 and you can drop it at any time without taking a special action to do so. However, the shield’s Integrity is reduced by 1, it can be disarmed, and it is instead dropped upon being hooked, landing equidistantly between you and your opponent.",

        cushioned:
            "Apply to your armor. Its Padding and Fatigue both increase by 1.",

        flanged:
            "Apply to a mace. If a sword parries your mace, reroll the damage. If the result exceeds 10, the sword breaks and is unusable.",

        "gigue-strap":
            "Apply to a non-buckler shield. You can stow and draw this shield on a side chosen when you take this skill. While stowed, the respective arm can still be used to support a two-handed weapon but cannot wield an object by itself. Additionally, your stowed shield’s Reach is 0, but it can still be used to block, with disadvantage in the chosen (non-forward) direction. You may only take this skill once.",

        reinforced:
            "Apply to any weapon or shield. Its Weight increases by 1. If it’s a shield, its Integrity increases by 1. If it’s a weapon, give it an Integrity of 2. Each time it would be destroyed, reduce its Integrity by 1.",

        spiked:
            "Apply to a flail. The flail’s Bash is a Punch instead.",

        "top-spike":
            "Apply to a warhammer. The warhammer has a Thrust equal to its Bash."

    });

})();