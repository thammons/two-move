export type BoardItemType = 'empty' | 'player' | 'wall' | 'goal';
export type AttributeType = 'seen' | 'unseen' | 'fog' | 'error-west' | 'error-east' | 'error-north' | 'error-south';
export type Direction = 'north' | 'south' | 'east' | 'west';
export interface IBoardItem {
    type: BoardItemType;
    location: number;
    direction?: Direction;
}

export interface IBoardCell {
    items: IBoardItem[];
    attributes: AttributeType[];
}