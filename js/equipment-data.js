// ============================================================
// KNIGHTS & KNAVES
// EQUIPMENT REFERENCE DATA
// ============================================================
//
// This file contains INHERENT equipment properties only.
//
// Weapon and shield numbers are taken from pages 3–5 of
// K&K Rulebook v1.01.
//
// Dynamic Gear Sheet calculations such as:
//
// - Character Base Reach
// - Current Might
// - Two-handed bonus application
// - Current Shield Integrity
// - Skill-granted attacks/defenses
//
// are handled elsewhere.
// ============================================================

(function () {

    "use strict";


    window.KKModificationData = {

        "center-grip": {
            target: "nonBucklerShield"
        },

        cushioned: {
            target: "armor",
            once: true
        },

        flanged: {
            target: "mace"
        },

        "gigue-strap": {
            target: "nonBucklerShield"
        },

        reinforced: {
            target: "weaponOrShield"
        },

        spiked: {
            target: "flail"
        },

        "top-spike": {
            target: "warhammer"
        }

    };


    window.KKEquipmentData = {


        // ====================================================
        // SHIELDS
        // ====================================================

        buckler: {

            name: "Buckler",
            type: "shield",

            hands: 1,
            sidearm: false,
            shield: true,

            reach: {
                min: 0,
                max: 0
            },

            defenses: {
                Block: 1
            },

            durability: null,
            weight: 0

        },


        heater: {

            name: "Heater Shield",
            type: "shield",

            hands: 1,
            sidearm: false,
            shield: true,

            reach: {
                min: 1,
                max: 1
            },

            defenses: {
                Block: 3
            },

            durability: 3,
            weight: 1

        },


        kite: {

            name: "Kite Shield",
            type: "shield",

            hands: 1,
            sidearm: false,
            shield: true,

            reach: {
                min: 2,
                max: 2
            },

            defenses: {
                Block: 4
            },

            durability: 4,
            weight: 2

        },


        round: {

            name: "Round Shield",
            type: "shield",

            hands: 1,
            sidearm: false,
            shield: true,

            reach: {
                min: 2,
                max: 3
            },

            defenses: {
                Block: 6
            },

            durability: 4,
            weight: 3

        },


        tower: {

            name: "Tower Shield",
            type: "shield",

            hands: 1,
            sidearm: false,
            shield: true,

            reach: {
                min: 3,
                max: 3
            },

            defenses: {
                Block: 8
            },

            durability: 5,
            weight: 4

        },


        // ====================================================
        // SWORDS
        // ====================================================

        dagger: {

            name: "Dagger",
            type: "sword",

            hands: 1,
            sidearm: true,
            shield: false,

            reach: {
                min: 0,
                max: 0
            },

            defenses: {
                Parry: 0
            },

            strikes: {
                Slash: "d8",
                Thrust: "2d10"
            },

            weight: 0

        },


        shortsword: {

            name: "Shortsword",
            type: "sword",

            hands: 1,
            sidearm: true,
            shield: false,

            reach: {
                min: 0,
                max: 1
            },

            defenses: {
                Parry: 2
            },

            strikes: {
                Slash: "d8",
                Thrust: "2d8"
            },

            weight: 0

        },


        falchion: {

            name: "Falchion",
            type: "sword",

            hands: 1,
            sidearm: true,
            shield: false,

            reach: {
                min: 1,
                max: 2
            },

            defenses: {
                Parry: 1
            },

            strikes: {
                Slash: "2d8",
                Thrust: "2d4"
            },

            weight: 1

        },


        "arming-sword": {

            name: "Arming Sword",
            type: "sword",

            hands: 1,
            sidearm: true,
            shield: false,

            reach: {
                min: 1,
                max: 2
            },

            defenses: {
                Parry: 3
            },

            strikes: {
                Slash: "d12",
                Thrust: "2d6"
            },

            weight: 1

        },


        "bastard-sword": {

            name: "Bastard Sword",
            type: "sword",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 1,
                max: 3
            },

            defenses: {
                Parry: 1
            },

            strikes: {
                Slash: "d10",
                Thrust: "d6"
            },

            versatile: "d4",
            weight: 1

        },


        longsword: {

            name: "Longsword",
            type: "sword",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 2,
                max: 4
            },

            defenses: {
                Parry: 1
            },

            strikes: {
                Slash: "d10",
                Thrust: "d6"
            },

            versatile: "d6",
            weight: 2

        },


        "war-sword": {

            name: "War Sword",
            type: "sword",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 2,
                max: 5
            },

            defenses: {
                Parry: 0
            },

            strikes: {
                Slash: "d8",
                Thrust: "d4"
            },

            versatile: "d8",
            weight: 2

        },


        estoc: {

            name: "Estoc",
            type: "sword",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 3,
                max: 6
            },

            defenses: {
                Parry: 5
            },

            strikes: {
                Thrust: "d8 + d10"
            },

            weight: 3

        },


        greatsword: {

            name: "Greatsword",
            type: "sword",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 3,
                max: 7
            },

            defenses: {
                Parry: 5
            },

            strikes: {
                Slash: "d8 + d10",
                Thrust: "2d6"
            },

            weight: 3

        },


        // ====================================================
        // AXES
        // ====================================================

        handaxe: {

            name: "Handaxe",
            type: "axe",

            hands: 1,
            sidearm: true,
            shield: false,

            reach: {
                min: 1,
                max: 2
            },

            strikes: {
                Chop: "2d4",
                Thrust: "d6"
            },

            tools: {
                Hook: 2
            },

            weight: 2

        },


        "battle-axe": {

            name: "Battle Axe",
            type: "axe",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 1,
                max: 2
            },

            twoHandedReachMax: 4,

            strikes: {
                Chop: "d8",
                Thrust: "d4"
            },

            tools: {
                Hook: 0
            },

            versatile: "d4",
            weight: 3

        },


        "dane-axe": {

            name: "Dane Axe",
            type: "axe",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 3,
                max: 6
            },

            strikes: {
                Chop: "d6 + d8",
                Thrust: "d6"
            },

            tools: {
                Hook: 3
            },

            weight: 3

        },


        // ====================================================
        // BLUDGEONS
        // ====================================================

        club: {

            name: "Club",
            type: "bludgeon",

            hands: 1,
            sidearm: true,
            shield: false,

            reach: {
                min: 1,
                max: 1
            },

            strikes: {
                Bash: "2d4"
            },

            weight: 0

        },


        mace: {

            name: "Mace",
            type: "bludgeon",

            hands: 1,
            sidearm: true,
            shield: false,

            reach: {
                min: 1,
                max: 1
            },

            strikes: {
                Bash: "d4 + d6"
            },

            weight: 1

        },


        warhammer: {

            name: "Warhammer",
            type: "bludgeon",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 1,
                max: 2
            },

            strikes: {
                Bash: "2d4",
                Punch: "2d4"
            },

            tools: {
                Hook: 0
            },

            versatile: "d4",
            weight: 2

        },


        "morning-star": {

            name: "Morning Star",
            type: "bludgeon",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 2,
                max: 3
            },

            twoHandedReachMax: 4,

            strikes: {
                Punch: "2d4",
                Thrust: "d4"
            },

            versatile: "d6",
            weight: 3

        },


        maul: {

            name: "Maul",
            type: "bludgeon",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 2,
                max: 4
            },

            strikes: {
                Bash: "2d6 + 2d4"
            },

            weight: 4

        },


        goedendag: {

            name: "Goedendag",
            type: "bludgeon",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 3,
                max: 4
            },

            twoHandedReachMax: 5,

            strikes: {
                Bash: "d4",
                Thrust: "d4"
            },

            versatile: "d8",
            weight: 3

        },


        // ====================================================
        // POLEARMS
        // ====================================================

        stave: {

            name: "Stave",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 3,
                max: 4
            },

            strikes: {
                Bash: "2d4"
            },

            weight: 0

        },


        spear: {

            name: "Spear",
            type: "polearm",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 4,
                max: 4
            },

            twoHandedReachMax: 8,

            strikes: {
                Thrust: "2d8"
            },

            versatile: "d6",
            weight: 1

        },


        swordstaff: {

            name: "Swordstaff",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 4,
                max: 8
            },

            defenses: {
                Catch: 3
            },

            strikes: {
                Bash: "d4 + d6",
                Slash: "2d6",
                Thrust: "2d8"
            },

            tools: {
                Hook: 1
            },

            weight: 3

        },


        poleaxe: {

            name: "Poleaxe",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 4,
                max: 9
            },

            defenses: {
                Catch: 4
            },

            strikes: {
                Bash: "d6 + d8",
                Thrust: "d6 + d8",
                Chop: "d6 + d8"
            },

            tools: {
                Hook: 4
            },

            weight: 4

        },


        "bec-de-corbin": {

            name: "Bec de Corbin",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 4,
                max: 9
            },

            defenses: {
                Catch: 1
            },

            strikes: {
                Bash: "2d8",
                Thrust: "2d8",
                Punch: "d6 + d8"
            },

            tools: {
                Hook: 2
            },

            weight: 4

        },


        glaive: {

            name: "Glaive",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 5,
                max: 10
            },

            defenses: {
                Catch: 2
            },

            strikes: {
                Slash: "2d12",
                Thrust: "2d4"
            },

            tools: {
                Hook: 1
            },

            weight: 3

        },


        billhook: {

            name: "Billhook",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 5,
                max: 10
            },

            defenses: {
                Catch: 3
            },

            strikes: {
                Slash: "2d8",
                Thrust: "d8 + d10"
            },

            tools: {
                Hook: 5
            },

            weight: 3

        },


        halberd: {

            name: "Halberd",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 5,
                max: 11
            },

            defenses: {
                Catch: 4
            },

            strikes: {
                Slash: "2d6",
                Thrust: "d8 + d10",
                Chop: "d6 + d8"
            },

            tools: {
                Hook: 4
            },

            weight: 4

        },


        pike: {

            name: "Pike",
            type: "polearm",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 6,
                max: 13
            },

            strikes: {
                Thrust: "2d12"
            },

            weight: 2

        },


        // ====================================================
        // FLAILS
        // ====================================================

        flail: {

            name: "Flail",
            type: "flail",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 3,
                max: 3
            },

            strikes: {
                Bash: "d12"
            },

            tools: {
                Wrap: 3
            },

            weight: 1

        },


        "chain-flail": {

            name: "Chain Flail",
            type: "flail",

            hands: 1,
            sidearm: false,
            shield: false,

            reach: {
                min: 6,
                max: 6
            },

            strikes: {
                Bash: "d8"
            },

            tools: {
                Wrap: 5
            },

            versatile: "d6",
            weight: 1

        },


        "war-flail": {

            name: "War Flail",
            type: "flail",

            hands: 2,
            sidearm: false,
            shield: false,

            reach: {
                min: 8,
                max: 8
            },

            strikes: {
                Bash: "2d8"
            },

            tools: {
                Wrap: 3
            },

            weight: 2

        }

    };

})();