// ============================================================
// KNIGHTS & KNAVES - SHARED CHARACTER STATE
// ============================================================

(function () {

    "use strict";


    // ========================================================
    // STORAGE SETTINGS
    // ========================================================

    const STORAGE_KEY =
        "knightsAndKnavesCharacterState";


    // ========================================================
    // GEAR LOCATION NAMES
    // ========================================================
    //
    // A two-handed weapon may appear in BOTH leftHand and
    // rightHand using the same instance ID.
    //
    // A one-handed weapon wielded with both hands will use the
    // same system.
    //
    // Swashbuckling Bucklers can also accompany a sidearm in
    // either hand without replacing that sidearm.
    // ========================================================

    const GEAR_LOCATIONS = [

        "leftHand",
        "rightHand",

        "leftHandBuckler",
        "rightHandBuckler",

        "leftSidearm",
        "rightSidearm",

        "leftGigue",
        "rightGigue",

        "leftBuckler",
        "rightBuckler",

        "stowedShield"

    ];


    // ========================================================
    // DEFAULT STATE
    // ========================================================

    function createDefaultState() {

        return {

            version: 5,


            // ====================================================
            // BUILDER
            // ====================================================

            builder: {

                startingPoints: 35,

                physique: null,
                height: null,
                armor: null,


                // ------------------------------------------------
                // BUILDER EQUIPMENT QUANTITIES
                // ------------------------------------------------

                equipment: {},


                // ------------------------------------------------
                // CHARACTER SKILLS
                // ------------------------------------------------

                skills: {},


                // ------------------------------------------------
                // EQUIPMENT MODIFICATIONS
                // ------------------------------------------------

                modifications: {},


                // ------------------------------------------------
                // POINT SPENDING
                // ------------------------------------------------

                spent: {

                    gear: 0,
                    skills: 0

                }

            },


            // ====================================================
            // DERIVED MAIN-SHEET VALUES
            // ====================================================
            //
            // These values are published by main-sheet.js after
            // its final calculations. Other sheets can read them
            // without duplicating Main Sheet logic.
            // ====================================================

            derived: {

    might: 0,
    baseReach: 0,
    currentFatigue: 0,

    headInjuries: 0,
    headWounds: 0,

    headInjuryTintDismissed: false

},


            // ====================================================
            // INDIVIDUAL EQUIPMENT INVENTORY
            // ====================================================

            inventory: {

                nextInstanceNumber: 1,

                items: []

            },


            // ====================================================
            // GEAR SHEET LOCATIONS
            // ====================================================

            gearSheet: {

                // ------------------------------------------------
                // EQUIPPED HANDS
                // ------------------------------------------------

                leftHand: null,
                rightHand: null,


                // ------------------------------------------------
                // SWASHBUCKLING BUCKLERS CURRENTLY IN HAND
                // ------------------------------------------------
                //
                // These do NOT occupy the normal hand slot.
                //
                // This allows:
                //
                // Right Hand:
                // Dagger + Buckler
                //
                // when Swashbuckling permits that combination.
                // ------------------------------------------------

                leftHandBuckler: null,
                rightHandBuckler: null,


                // ------------------------------------------------
                // STOWED SIDEARMS
                // ------------------------------------------------

                leftSidearm: null,
                rightSidearm: null,


                // ------------------------------------------------
                // GIGUE STRAP
                // ------------------------------------------------

                leftGigue: null,
                rightGigue: null,


                // ------------------------------------------------
                // SWASHBUCKLING STOWED BUCKLERS
                // ------------------------------------------------

                leftBuckler: null,
                rightBuckler: null,


                // ------------------------------------------------
                // GENERAL STOWED SHIELD
                // ------------------------------------------------

                stowedShield: null

            }

        };

    }


    // ========================================================
    // NORMALIZE INVENTORY ITEM
    // ========================================================

    function normalizeInventoryItem(
        item
    ) {

        if (
            !item ||
            typeof item !==
                "object"
        ) {

            return null;

        }


        return {

            id:
                String(
                    item.id ||
                    ""
                ),

            itemId:
                String(
                    item.itemId ||
                    ""
                ),

            name:
                item.name
                    ? String(
                        item.name
                    )
                    : "",

            source:
                item.source ===
                    "pickup"
                        ? "pickup"
                        : "builder",

            purchaseCost:
                Number(
                    item.purchaseCost
                ) || 0,

            hands:
                Number(
                    item.hands
                ) || 1,

            sidearm:
                item.sidearm ===
                true,

            shield:
                item.shield ===
                true,


            // ------------------------------------------------
            // INSTANCE-SPECIFIC DURABILITY
            // ------------------------------------------------
            //
            // null = this item does not currently have a
            // remembered Durability value.
            //
            // Numeric values are preserved exactly so an
            // individual shield keeps its current Durability
            // while moving between Gear Sheet zones.
            // ------------------------------------------------

            durability:
                (
                    item.durability !==
                        null &&
                    item.durability !==
                        undefined &&
                    item.durability !==
                        "" &&
                    Number.isFinite(
                        Number(
                            item.durability
                        )
                    )
                )
                    ? Number(
                        item.durability
                    )
                    : null,


            // ------------------------------------------------
            // INSTANCE-SPECIFIC SHIELD INTEGRITY
            // ------------------------------------------------
            //
            // Shields use Integrity rather than Durability.
            //
            // This MUST be preserved during normalization or
            // every save will erase the changed value.
            // ------------------------------------------------

            integrity:
                (
                    item.integrity !==
                        null &&
                    item.integrity !==
                        undefined &&
                    item.integrity !==
                        "" &&
                    Number.isFinite(
                        Number(
                            item.integrity
                        )
                    )
                )
                    ? Number(
                        item.integrity
                    )
                    : null

        };

    }


    // ========================================================
    // NORMALIZE STATE
    // ========================================================

    function normalizeState(
        savedState
    ) {

        const defaults =
            createDefaultState();


        if (
            !savedState ||
            typeof savedState !==
                "object"
        ) {

            return defaults;

        }


        const savedInventory =
            savedState.inventory &&
            typeof savedState.inventory ===
                "object"
                    ? savedState.inventory
                    : {};


        const savedItems =
            Array.isArray(
                savedInventory.items
            )
                ? savedInventory.items
                : [];


        const normalizedItems =
            savedItems
                .map(
                    normalizeInventoryItem
                )
                .filter(
                    function (
                        item
                    ) {

                        return (
                            item &&
                            item.id &&
                            item.itemId
                        );

                    }
                );


        const savedGearSheet =
            savedState.gearSheet &&
            typeof savedState.gearSheet ===
                "object"
                    ? savedState.gearSheet
                    : {};


        const normalizedGearSheet = {

            ...defaults.gearSheet

        };


        GEAR_LOCATIONS.forEach(
            function (
                location
            ) {

                const value =
                    savedGearSheet[
                        location
                    ];


                normalizedGearSheet[
                    location
                ] =
                    typeof value ===
                        "string"
                            ? value
                            : null;

            }
        );


        return {

            ...defaults,
            ...savedState,

            version: 5,


            builder: {

                ...defaults.builder,
                ...(
                    savedState.builder ||
                    {}
                ),


                equipment: {

                    ...defaults
                        .builder
                        .equipment,

                    ...(
                        savedState.builder &&
                        savedState
                            .builder
                            .equipment
                                ? savedState
                                    .builder
                                    .equipment
                                : {}
                    )

                },


                skills: {

                    ...defaults
                        .builder
                        .skills,

                    ...(
                        savedState.builder &&
                        savedState
                            .builder
                            .skills
                                ? savedState
                                    .builder
                                    .skills
                                : {}
                    )

                },


                modifications: {

                    ...defaults
                        .builder
                        .modifications,

                    ...(
                        savedState.builder &&
                        savedState
                            .builder
                            .modifications
                                ? savedState
                                    .builder
                                    .modifications
                                : {}
                    )

                },


                spent: {

                    ...defaults
                        .builder
                        .spent,

                    ...(
                        savedState.builder &&
                        savedState
                            .builder
                            .spent
                                ? savedState
                                    .builder
                                    .spent
                                : {}
                    )

                }

            },


            derived: {

                ...defaults.derived,
                ...(
                    savedState.derived ||
                    {}
                ),

                might:
                    Number.isFinite(
                        Number(
                            savedState.derived &&
                            savedState
                                .derived
                                .might
                        )
                    )
                        ? Number(
                            savedState
                                .derived
                                .might
                        )
                        : defaults
                            .derived
                            .might,

                baseReach:
                    Number.isFinite(
                        Number(
                            savedState.derived &&
                            savedState
                                .derived
                                .baseReach
                        )
                    )
                        ? Number(
                            savedState
                                .derived
                                .baseReach
                        )
                        : defaults
                            .derived
                            .baseReach,

                currentFatigue:
                    Math.max(
                        0,
                        Number.isFinite(
                            Number(
                                savedState.derived &&
                                savedState
                                    .derived
                                    .currentFatigue
                            )
                        )
                            ? Number(
                                savedState
                                    .derived
                                    .currentFatigue
                            )
                            : defaults
                                .derived
                                .currentFatigue
                    )

            },


            inventory: {

                ...defaults.inventory,
                ...savedInventory,

                nextInstanceNumber:
                    Math.max(
                        1,
                        Number(
                            savedInventory
                                .nextInstanceNumber
                        ) || 1
                    ),

                items:
                    normalizedItems

            },


            gearSheet:
                normalizedGearSheet

        };

    }


        // ========================================================
    // LOAD STATE
    // ========================================================

    function load() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (
                !stored
            ) {

                return createDefaultState();

            }


            return normalizeState(
                JSON.parse(
                    stored
                )
            );

        }

        catch (
            error
        ) {

            console.error(
                "Could not load character state:",
                error
            );


            return createDefaultState();

        }

    }


    // ========================================================
    // SAVE STATE
    // ========================================================

    function save(
        state
    ) {

        const normalized =
            normalizeState(
                state
            );


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                normalized
            )
        );


        window.dispatchEvent(
            new CustomEvent(
                "knights-knaves-state-changed",
                {

                    detail:
                        normalized

                }
            )
        );


        return normalized;

    }


    // ========================================================
    // GET REMAINING POINTS
    // ========================================================

    function getRemainingPoints(
        state = load()
    ) {

        const starting =
            Number(
                state
                    .builder
                    .startingPoints
            ) || 35;


        const gearSpent =
            Number(
                state
                    .builder
                    .spent
                    .gear
            ) || 0;


        const skillSpent =
            Number(
                state
                    .builder
                    .spent
                    .skills
            ) || 0;


        return (
            starting -
            gearSpent -
            skillSpent
        );

    }


    // ========================================================
    // CREATE EQUIPMENT INSTANCE ID
    // ========================================================

    function createInstanceId(
        state,
        itemId
    ) {

        const number =
            Math.max(
                1,
                Number(
                    state
                        .inventory
                        .nextInstanceNumber
                ) || 1
            );


        state
            .inventory
            .nextInstanceNumber =
                number +
                1;


        return (
            String(
                itemId
            ) +
            "-" +
            number
        );

    }


    // ========================================================
    // CREATE EQUIPMENT INSTANCE
    // ========================================================

    function createEquipmentInstance(
        state,
        data
    ) {

        const itemId =
            String(
                data.itemId ||
                ""
            );


        const instance = {

            id:
                createInstanceId(
                    state,
                    itemId
                ),

            itemId:
                itemId,

            name:
                data.name
                    ? String(
                        data.name
                    )
                    : itemId,

            source:
                data.source ===
                    "pickup"
                        ? "pickup"
                        : "builder",

            purchaseCost:
                Number(
                    data.purchaseCost
                ) || 0,

            hands:
                Number(
                    data.hands
                ) || 1,

            sidearm:
                data.sidearm ===
                true,

            shield:
                data.shield ===
                true,


            // ------------------------------------------------
            // INSTANCE-SPECIFIC DURABILITY
            // ------------------------------------------------
            //
            // Durability is stored on the individual physical
            // equipment instance.
            //
            // null means that the item either:
            //
            // - does not use Durability, or
            // - has not yet had its starting Durability
            //   initialized by the Gear Sheet.
            //
            // This allows two copies of the same shield to
            // remember different current Durability values.
            // ------------------------------------------------

            durability:
                (
                    data.durability !==
                        null &&
                    data.durability !==
                        undefined &&
                    data.durability !==
                        "" &&
                    Number.isFinite(
                        Number(
                            data.durability
                        )
                    )
                )
                    ? Number(
                        data.durability
                    )
                    : null,


            // ------------------------------------------------
            // INSTANCE-SPECIFIC SHIELD INTEGRITY
            // ------------------------------------------------

            integrity:
                (
                    data.integrity !==
                        null &&
                    data.integrity !==
                        undefined &&
                    data.integrity !==
                        "" &&
                    Number.isFinite(
                        Number(
                            data.integrity
                        )
                    )
                )
                    ? Number(
                        data.integrity
                    )
                    : null

        };


        state
            .inventory
            .items
            .push(
                instance
            );


        return instance;

    }


    // ========================================================
    // GET EQUIPMENT INSTANCE
    // ========================================================

    function getEquipmentInstance(
        state,
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return null;

        }


        return (
            state
                .inventory
                .items
                .find(
                    function (
                        item
                    ) {

                        return (
                            item.id ===
                            instanceId
                        );

                    }
                ) ||
            null
        );

    }


    // ========================================================
    // GET INSTANCE LOCATIONS
    // ========================================================

    function getInstanceLocations(
        state,
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return [];

        }


        return GEAR_LOCATIONS.filter(
            function (
                location
            ) {

                return (
                    state
                        .gearSheet[
                            location
                        ] ===
                    instanceId
                );

            }
        );

    }


    // ========================================================
    // IS INSTANCE LOCATED
    // ========================================================

    function isInstanceLocated(
        state,
        instanceId
    ) {

        return (
            getInstanceLocations(
                state,
                instanceId
            ).length >
            0
        );

    }


    // ========================================================
    // CLEAR INSTANCE FROM ALL LOCATIONS
    // ========================================================

    function clearInstanceLocations(
        state,
        instanceId
    ) {

        GEAR_LOCATIONS.forEach(
            function (
                location
            ) {

                if (
                    state
                        .gearSheet[
                            location
                        ] ===
                    instanceId
                ) {

                    state
                        .gearSheet[
                            location
                        ] =
                            null;

                }

            }
        );


        return state;

    }


    // ========================================================
    // DELETE EQUIPMENT INSTANCE
    // ========================================================

    function deleteEquipmentInstance(
        state,
        instanceId
    ) {

        clearInstanceLocations(
            state,
            instanceId
        );


        // Remove modification assignments that belonged to
        // this physical copy of the item.

        Object.keys(
            state.builder.modifications ||
            {}
        ).forEach(
            function (
                key
            ) {

                const value =
                    state
                        .builder
                        .modifications[
                            key
                        ];


                if (
                    !Array.isArray(
                        value
                    )
                ) {

                    return;

                }


                const remaining =
                    value.filter(
                        function (
                            targetId
                        ) {

                            return (
                                String(
                                    targetId
                                ) !==
                                String(
                                    instanceId
                                )
                            );

                        }
                    );


                if (
                    remaining.length >
                    0
                ) {

                    state
                        .builder
                        .modifications[
                            key
                        ] =
                            remaining;

                }

                else {

                    delete state
                        .builder
                        .modifications[
                            key
                        ];

                }

            }
        );


        state
            .inventory
            .items =
                state
                    .inventory
                    .items
                    .filter(
                        function (
                            item
                        ) {

                            return (
                                item.id !==
                                instanceId
                            );

                        }
                    );


        return state;

    }


    // ========================================================
    // GET BUILDER INSTANCES
    // ========================================================

    function getBuilderInstances(
        state
    ) {

        return state
            .inventory
            .items
            .filter(
                function (
                    item
                ) {

                    return (
                        item.source ===
                        "builder"
                    );

                }
            );

    }


        // ========================================================
    // RECONCILE BUILDER INVENTORY
    // ========================================================
    //
    // Builder Page 1 stores quantities.
    //
    // The Gear Sheet needs individual physical copies.
    //
    // This function makes the inventory instance count match
    // the Builder Page 1 quantity for each item.
    // ========================================================

    function reconcileBuilderInventory(
        state,
        equipmentDefinitions
    ) {

        const desiredQuantities =
            state
                .builder
                .equipment ||
            {};


        const definitions =
            equipmentDefinitions ||
            {};


        const itemIds =
            new Set([

                ...Object.keys(
                    desiredQuantities
                ),

                ...getBuilderInstances(
                    state
                ).map(
                    function (
                        item
                    ) {

                        return item.itemId;

                    }
                )

            ]);


        itemIds.forEach(
            function (
                itemId
            ) {

                const desired =
                    Math.max(
                        0,
                        Number(
                            desiredQuantities[
                                itemId
                            ]
                        ) || 0
                    );


                let existing =
                    getBuilderInstances(
                        state
                    ).filter(
                        function (
                            item
                        ) {

                            return (
                                item.itemId ===
                                itemId
                            );

                        }
                    );


                // --------------------------------------------
                // TOO MANY INSTANCES
                // --------------------------------------------

                while (
                    existing.length >
                    desired
                ) {

                    const unlocated =
                        existing.find(
                            function (
                                item
                            ) {

                                return (
                                    !isInstanceLocated(
                                        state,
                                        item.id
                                    )
                                );

                            }
                        );


                    const itemToRemove =
                        unlocated ||
                        existing[
                            existing.length -
                            1
                        ];


                    deleteEquipmentInstance(
                        state,
                        itemToRemove.id
                    );


                    existing =
                        getBuilderInstances(
                            state
                        ).filter(
                            function (
                                item
                            ) {

                                return (
                                    item.itemId ===
                                    itemId
                                );

                            }
                        );

                }


                // --------------------------------------------
                // NOT ENOUGH INSTANCES
                // --------------------------------------------

                const definition =
                    definitions[
                        itemId
                    ] ||
                    {};


                while (
                    existing.length <
                    desired
                ) {

                    createEquipmentInstance(
                        state,
                        {

                            itemId:
                                itemId,

                            name:
                                definition.name ||
                                itemId,

                            source:
                                "builder",

                            purchaseCost:
                                Number(
                                    definition.cost
                                ) || 0,

                            hands:
                                Number(
                                    definition.hands
                                ) || 1,

                            sidearm:
                                definition.sidearm ===
                                true,

                            shield:
                                definition.shield ===
                                true,


                            // --------------------------------
                            // STARTING DURABILITY
                            // --------------------------------

                            durability:
                                (
                                    definition.durability !==
                                        null &&
                                    definition.durability !==
                                        undefined &&
                                    definition.durability !==
                                        "" &&
                                    Number.isFinite(
                                        Number(
                                            definition.durability
                                        )
                                    )
                                )
                                    ? Number(
                                        definition.durability
                                    )
                                    : null

                        }
                    );


                    existing =
                        getBuilderInstances(
                            state
                        ).filter(
                            function (
                                item
                            ) {

                                return (
                                    item.itemId ===
                                    itemId
                                );

                            }
                        );

                }

            }
        );


        return state;

    }


    // ========================================================
    // CHECK WHETHER LOCATION IS FREE
    // ========================================================

    function isGearLocationFree(
        state,
        location
    ) {

        if (
            !GEAR_LOCATIONS.includes(
                location
            )
        ) {

            return false;

        }


        return (
            !state
                .gearSheet[
                    location
                ]
        );

    }


    // ========================================================
    // AUTO PLACE INSTANCE
    // ========================================================
    //
    // Default Builder placement:
    //
    // SIDEARMS
    //     1. Right Sidearm
    //     2. Left Sidearm
    //     3. Right Hand
    //     4. Left Hand
    //
    // SHIELDS
    //     1. Left Hand
    //     2. Right Hand
    //
    // ORDINARY ONE-HANDED WEAPONS
    //     1. Right Hand
    //     2. Left Hand
    //
    // TWO-HANDED WEAPONS
    //     Both hands simultaneously.
    //
    // Existing located items are NEVER automatically moved.
    // ========================================================

    function autoPlaceInstance(
        state,
        instanceId
    ) {

        const instance =
            getEquipmentInstance(
                state,
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


        // ----------------------------------------------------
        // DO NOT MOVE AN ITEM THAT IS ALREADY PLACED
        // ----------------------------------------------------

        if (
            isInstanceLocated(
                state,
                instanceId
            )
        ) {

            return true;

        }


        // ----------------------------------------------------
        // SIDEARM
        // ----------------------------------------------------

        if (
            instance.sidearm ===
            true
        ) {

            // ------------------------------------------------
            // RIGHT SIDEARM FIRST
            // ------------------------------------------------

            if (
                isGearLocationFree(
                    state,
                    "rightSidearm"
                )
            ) {

                state
                    .gearSheet
                    .rightSidearm =
                        instanceId;


                return true;

            }


            // ------------------------------------------------
            // LEFT SIDEARM SECOND
            // ------------------------------------------------

            if (
                isGearLocationFree(
                    state,
                    "leftSidearm"
                )
            ) {

                state
                    .gearSheet
                    .leftSidearm =
                        instanceId;


                return true;

            }


            // ------------------------------------------------
            // FALL BACK TO RIGHT HAND
            // ------------------------------------------------

            if (
                isGearLocationFree(
                    state,
                    "rightHand"
                )
            ) {

                state
                    .gearSheet
                    .rightHand =
                        instanceId;


                return true;

            }


            // ------------------------------------------------
            // THEN LEFT HAND
            // ------------------------------------------------

            if (
                isGearLocationFree(
                    state,
                    "leftHand"
                )
            ) {

                state
                    .gearSheet
                    .leftHand =
                        instanceId;


                return true;

            }


            return false;

        }


        // ----------------------------------------------------
        // TRUE TWO-HANDED ITEM
        // ----------------------------------------------------

        if (
            Number(
                instance.hands
            ) ===
            2
        ) {

            if (
                !isGearLocationFree(
                    state,
                    "leftHand"
                ) ||
                !isGearLocationFree(
                    state,
                    "rightHand"
                )
            ) {

                return false;

            }


            /*
               The SAME physical instance ID occupies both
               hands.
            */

            state
                .gearSheet
                .leftHand =
                    instanceId;


            state
                .gearSheet
                .rightHand =
                    instanceId;


            return true;

        }


        // ----------------------------------------------------
        // SHIELD
        // ----------------------------------------------------

        if (
            instance.shield ===
            true
        ) {

            // ------------------------------------------------
            // SHIELDS DEFAULT LEFT
            // ------------------------------------------------

            if (
                isGearLocationFree(
                    state,
                    "leftHand"
                )
            ) {

                state
                    .gearSheet
                    .leftHand =
                        instanceId;


                return true;

            }


            if (
                isGearLocationFree(
                    state,
                    "rightHand"
                )
            ) {

                state
                    .gearSheet
                    .rightHand =
                        instanceId;


                return true;

            }


            return false;

        }


        // ----------------------------------------------------
        // ORDINARY ONE-HANDED ITEM
        // ----------------------------------------------------
        //
        // Weapons default Right -> Left.
        // ----------------------------------------------------

        if (
            isGearLocationFree(
                state,
                "rightHand"
            )
        ) {

            state
                .gearSheet
                .rightHand =
                    instanceId;


            return true;

        }


        if (
            isGearLocationFree(
                state,
                "leftHand"
            )
        ) {

            state
                .gearSheet
                .leftHand =
                    instanceId;


            return true;

        }


        return false;

    }


    // ========================================================
    // AUTO PLACE BUILDER INVENTORY
    // ========================================================
    //
    // Only unlocated Builder-owned items are considered.
    //
    // This is deliberately conservative:
    //
    // if the player manually moved an item on the Gear Sheet,
    // Builder synchronization must NOT move it back to its
    // default position.
    // ========================================================

    function autoPlaceBuilderInventory(
        state
    ) {

        const builderInstances =
            getBuilderInstances(
                state
            );


        let changed =
            false;


        builderInstances.forEach(
            function (
                instance
            ) {

                if (
                    !instance ||
                    !instance.id
                ) {

                    return;

                }


                if (
                    isInstanceLocated(
                        state,
                        instance.id
                    )
                ) {

                    return;

                }


                if (
                    autoPlaceInstance(
                        state,
                        instance.id
                    )
                ) {

                    changed =
                        true;

                }

            }
        );


        return changed;

    }


        // ========================================================
    // REMOVE OWNED EQUIPMENT INSTANCE
    // ========================================================
    //
    // Picked-up items:
    //
    //     - removed from inventory
    //     - no Builder refund
    //
    // Builder-owned items:
    //
    //     - removed from inventory
    //     - Builder quantity reduced by 1
    //     - original purchase cost refunded
    //
    // Durability has no effect on refund value.
    // ========================================================

    function removeOwnedEquipmentInstance(
        state,
        instanceId
    ) {

        const instance =
            getEquipmentInstance(
                state,
                instanceId
            );


        if (
            !instance
        ) {

            return state;

        }


        // ----------------------------------------------------
        // BUILDER-OWNED ITEM
        // ----------------------------------------------------

        if (
            instance.source ===
            "builder"
        ) {

            const itemId =
                instance.itemId;


            const currentQuantity =
                Math.max(
                    0,
                    Number(
                        state
                            .builder
                            .equipment[
                                itemId
                            ]
                    ) || 0
                );


            const newQuantity =
                Math.max(
                    0,
                    currentQuantity -
                    1
                );


            if (
                newQuantity >
                0
            ) {

                state
                    .builder
                    .equipment[
                        itemId
                    ] =
                        newQuantity;

            }

            else {

                delete state
                    .builder
                    .equipment[
                        itemId
                    ];

            }


            // ------------------------------------------------
            // REFUND ORIGINAL PURCHASE COST
            // ------------------------------------------------

            const purchaseCost =
                Math.max(
                    0,
                    Number(
                        instance.purchaseCost
                    ) || 0
                );


            state
                .builder
                .spent
                .gear =
                    Math.max(
                        0,
                        (
                            Number(
                                state
                                    .builder
                                    .spent
                                    .gear
                            ) || 0
                        ) -
                        purchaseCost
                    );

        }


        // ----------------------------------------------------
        // DELETE PHYSICAL INSTANCE
        // ----------------------------------------------------

        deleteEquipmentInstance(
            state,
            instanceId
        );


        return state;

    }


    // ========================================================
    // COUNT BUILDER ITEM INSTANCES
    // ========================================================

    function countBuilderItemInstances(
        state,
        itemId
    ) {

        return getBuilderInstances(
            state
        ).filter(
            function (
                item
            ) {

                return (
                    item.itemId ===
                    itemId
                );

            }
        ).length;

    }


    // ========================================================
    // GET ALL INSTANCES OF ITEM
    // ========================================================

    function getEquipmentInstancesByItemId(
        state,
        itemId
    ) {

        return state
            .inventory
            .items
            .filter(
                function (
                    item
                ) {

                    return (
                        item.itemId ===
                        itemId
                    );

                }
            );

    }


    // ========================================================
    // GET FREE / UNLOCATED EQUIPMENT INSTANCES
    // ========================================================

    function getUnlocatedEquipmentInstances(
        state
    ) {

        return state
            .inventory
            .items
            .filter(
                function (
                    item
                ) {

                    return (
                        !isInstanceLocated(
                            state,
                            item.id
                        )
                    );

                }
            );

    }


    // ========================================================
    // SET GEAR LOCATION
    // ========================================================

    function setGearLocation(
        state,
        location,
        instanceId
    ) {

        if (
            !GEAR_LOCATIONS.includes(
                location
            )
        ) {

            return state;

        }


        // ----------------------------------------------------
        // CLEAR LOCATION
        // ----------------------------------------------------

        if (
            instanceId === null ||
            instanceId === undefined ||
            instanceId === ""
        ) {

            state
                .gearSheet[
                    location
                ] =
                    null;


            return state;

        }


        // ----------------------------------------------------
        // VERIFY INSTANCE EXISTS
        // ----------------------------------------------------

        const instance =
            getEquipmentInstance(
                state,
                instanceId
            );


        if (
            !instance
        ) {

            return state;

        }


        state
            .gearSheet[
                location
            ] =
                instanceId;


        return state;

    }


    // ========================================================
    // GET GEAR LOCATION
    // ========================================================

    function getGearLocation(
        state,
        location
    ) {

        if (
            !GEAR_LOCATIONS.includes(
                location
            )
        ) {

            return null;

        }


        return (
            state
                .gearSheet[
                    location
                ] ||
            null
        );

    }


    // ========================================================
    // CLEAN STALE GEAR LOCATIONS
    // ========================================================
    //
    // If an equipment instance no longer exists, remove its
    // ID from any Gear Sheet location that still references it.
    // ========================================================

    function cleanGearLocations(
        state
    ) {

        const validIds =
            new Set(
                state
                    .inventory
                    .items
                    .map(
                        function (
                            item
                        ) {

                            return item.id;

                        }
                    )
            );


        GEAR_LOCATIONS.forEach(
            function (
                location
            ) {

                const instanceId =
                    state
                        .gearSheet[
                            location
                        ];


                if (
                    instanceId &&
                    !validIds.has(
                        instanceId
                    )
                ) {

                    state
                        .gearSheet[
                            location
                        ] =
                            null;

                }

            }
        );


        return state;

    }


    // ========================================================
    // SET DERIVED VALUES
    // ========================================================
    //
    // Main Sheet uses this to publish calculated values needed
    // by other sheets.
    //
    // Currently:
    //
    // - Might
    // - Base Reach
    // ========================================================

    function setDerivedValues(
        state,
        values
    ) {

        if (
            !state.derived ||
            typeof state.derived !==
                "object"
        ) {

            state.derived = {

                might: 0,
                baseReach: 0

            };

        }


        if (
            values &&
            values.might !==
                undefined
        ) {

            const might =
                Number(
                    values.might
                );


            if (
                Number.isFinite(
                    might
                )
            ) {

                state
                    .derived
                    .might =
                        might;

            }

        }


        if (
            values &&
            values.baseReach !==
                undefined
        ) {

            const baseReach =
                Number(
                    values.baseReach
                );


            if (
                Number.isFinite(
                    baseReach
                )
            ) {

                state
                    .derived
                    .baseReach =
                        baseReach;

            }

        }


        return state;

    }


    // ========================================================
    // RESET ENTIRE BUILDER
    // ========================================================
    //
    // Builder-created equipment disappears.
    //
    // Free Gear Sheet pickup equipment remains because it was
    // never purchased through the Builder.
    //
    // This restores the behavior expected by builder-gear.js.
    // ========================================================

    function resetBuilder() {

        const state =
            load();


        const builderInstances =
            getBuilderInstances(
                state
            );


        builderInstances.forEach(
            function (
                item
            ) {

                deleteEquipmentInstance(
                    state,
                    item.id
                );

            }
        );


        // ----------------------------------------------------
        // RESET BUILDER DATA
        // ----------------------------------------------------

        state.builder =
            createDefaultState()
                .builder;


        // ----------------------------------------------------
        // CLEAN ANY STALE LOCATION REFERENCES
        // ----------------------------------------------------

        cleanGearLocations(
            state
        );


        // ----------------------------------------------------
        // SAVE
        // ----------------------------------------------------

        return save(
            state
        );

    }


    // ========================================================
    // RESET ENTIRE CHARACTER STATE
    // ========================================================
    //
    // Unlike resetBuilder(), this also removes free picked-up
    // equipment and resets derived values.
    // ========================================================

    function reset() {

        const state =
            createDefaultState();


        return save(
            state
        );

    }


        // ========================================================
    // PUBLIC API
    // ========================================================

    window.KKState = {

        STORAGE_KEY:
            STORAGE_KEY,

        GEAR_LOCATIONS:
            GEAR_LOCATIONS,


        // ----------------------------------------------------
        // STATE
        // ----------------------------------------------------

        createDefaultState:
            createDefaultState,

        normalizeState:
            normalizeState,

        load:
            load,

        save:
            save,

        reset:
            reset,

        resetBuilder:
            resetBuilder,


        // ----------------------------------------------------
        // POINTS
        // ----------------------------------------------------

        getRemainingPoints:
            getRemainingPoints,


        // ----------------------------------------------------
        // INVENTORY
        // ----------------------------------------------------

        createEquipmentInstance:
            createEquipmentInstance,

        getEquipmentInstance:
            getEquipmentInstance,

        getEquipmentInstancesByItemId:
            getEquipmentInstancesByItemId,

        getBuilderInstances:
            getBuilderInstances,

        getUnlocatedEquipmentInstances:
            getUnlocatedEquipmentInstances,

        countBuilderItemInstances:
            countBuilderItemInstances,

        reconcileBuilderInventory:
            reconcileBuilderInventory,

        autoPlaceInstance:
            autoPlaceInstance,

        autoPlaceBuilderInventory:
            autoPlaceBuilderInventory,

        deleteEquipmentInstance:
            deleteEquipmentInstance,

        removeOwnedEquipmentInstance:
            removeOwnedEquipmentInstance,


        // ----------------------------------------------------
        // LOCATIONS
        // ----------------------------------------------------

        getInstanceLocations:
            getInstanceLocations,

        isInstanceLocated:
            isInstanceLocated,

        clearInstanceLocations:
            clearInstanceLocations,

        setGearLocation:
            setGearLocation,

        getGearLocation:
            getGearLocation,

        cleanGearLocations:
            cleanGearLocations,


        // ----------------------------------------------------
        // DERIVED MAIN-SHEET VALUES
        // ----------------------------------------------------

        setDerivedValues:
            setDerivedValues

    };


    console.log(
        "character-state.js is working!"
    );

})();