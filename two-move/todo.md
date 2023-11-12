# TODOs

## Vertical / Side Scroller
- only show the collection of cells around the player within the viewable space
    - keep the player in the middle of the view untill there are no more cells in the given direction


## Map Builder View
- a map taller than it is wide will not let the player go south (40H X 10H)
    - TDD
    - unify the move validation logic
        - All Movers Shared Logic
            - When to turn will change
                - on key down, when a boundry is hit, 
            - How many turns they make will change (desired direction)
            - If they can take 1 invalid boundry or wall step will change
                - They should always be able to attempt 1 an invalid move
                    - board collison detection vs mover step validation
            - They do not require the whole board, just the map (h-w-walls)
                - move `isgoal` logic to the mover?

    - folder reogranization:
        1. ui component *(blockly, mapsettings, mapbuilder, board, welcome, scoreboard)*
            - *components: anything with events to pass through: gameboard, scoreboard, map-attributes, map-creator, blockly*
            - html
                - use tsx files with raw html for partials? **Research**
                - add in a LIGHT templating engine?
            - css
            - index.ts
                - view logic - mapping to data so the feature logic can consume it
                     - the view is just a different data source with event streams
        1. feature logic
            - *does NOT mirror the component structure. feature logic has different abstractions*
                1. events **Research**
                    - *pubsub connection handler, should be predictable across the site*
                    - events-manager.ts (index)
                        - wires triggers to handlers
                            - when something happens, it is one half of the convesation
                    - move-events-handlers.ts
                        - handle events related to turning? make this like a topic?
                    - settings-changed-events.ts
                    - types
                        - Signal - simple notification that *something* happened (ping)
                        - Event - data is being passed around
                1. game-assets
                    1. Moves
                        - rules as static functions, state passed in
                            - IsValidNextPosition - takes a move, a map (H, W, Walls)
                                - if the player can ocupy the square 
                                    - use the move's state to validate against the map
                            - isValidNextStep - takes a move, a map (H, W, Walls)
                                - you can walk into the wall, but you cant go through it 
                                    - use the move's state to validate against the map
                            - IsGoal - takes an ItemLocation, and a Map
                    1. Movers
                        - index
                            - state
                                - moveQueue
                                - 
                            - runMove - takes a player, a mover[], and the map
                                - hold logic to broadcast move events at a given interval
                                - calls getNextMove
                            - getNextMove
                                - *Pure function, mover and map passed in*
                                - Use Mover Objects 
                        - types
                            - MoverType (user-event, pacer, random-mover, etc)
                            - IMover
                                - type:MoverType
                                - directionMap?
                                - turnCondition
                                    - takes in the next move
                        - objects
                            - Mover (a class:IMover for each MoverType)
                                - getNextDirection(Move):Move
                    1. structures
                        - *it's just state representation. State is a snapshot in time. for IMap, IMapItem holds initial state. for Board, IMaItem holds the current state
                        - IMapItem 
                            - location
                            - type (player, enemy, powerup, loot)
                        - IColector
                            - Items - the items the collector (player) has
                        - IMap
                            - height
                            - width
                            - items[]
                                - items where start location is their location
                            - goal[]    
                                - 
                        - Board
                            - ICell[]
                            - getIMap
                                - returns the ICell[] as a map
                        - Move
                            - direction
                            - currentLocation
                            - desiredLocation
    
    - break up the `two-move.ts` file
        - lots of strange glue code

    - `src/ui/map-builder/` is a mess
        - extract the controls and events better by ui component type
            - build a model to interact with logic

    


## document the site
- Organize the code better
    - 
- Eventing **Research**
    - figure out a unified approach
        - what to MQs do? 
            - Topics? 
            - Find a message bus solution?
