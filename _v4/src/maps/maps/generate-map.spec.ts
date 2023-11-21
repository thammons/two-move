import { describe, test, expect } from "vitest";
import { getNextMap } from "./generate-map";
import { Direction } from "../index";

const settings = {
    height: 10,
    width: 10,
};

describe("generateMap - initialization", () => {
    test("should generate a map with the correct dimensions", () => {
        const map = getNextMap(settings);
        expect(map.height).toBe(10);
        expect(map.width).toBe(10);
    });

    test("should generate a map with a player", () => {
        const map = getNextMap(settings);
        expect(map.mapItems.get("player")).toBeDefined();
    });

    test("should generate a map with a player at the specified location", () => {
        const mapSettings = { ...settings, playerStartLocation: 50 };
        const map = getNextMap(mapSettings);
        expect(map.mapItems.get("player")![0].location).toBe(50);
    });

    test("should generate a map with a player facing the specified direction", () => {
        const mapSettings = {
            ...settings,
            playerStartLocation: 50,
            playerStartDirection: "north" as Direction,
        };
        const map = getNextMap(mapSettings);
        expect(map.mapItems.get("player")![0].direction).toBe("north");
    });

    test("should generate a map with a goal", () => {
        const map = getNextMap(settings);
        expect(map.mapItems.get("goal")).toBeDefined();
    });
});

describe("generateMap - walls", () => {
    test("should generate a map with walls", () => {
        const map = getNextMap(settings);
        expect(map.mapItems.get("wall")).toBeDefined();
    });

    test("should generate a map without walls at the player's location", () => {
        const mapSettings = { ...settings, playerStartLocation: 0 };
        const map = getNextMap(mapSettings);
        const wallLocations = map.mapItems
            .get("wall")!
            .map((wall) => wall.location);
        const player = map.mapItems.get("player")![0];
        expect(wallLocations.includes(player.location)).toBe(false);
    });

    test("should generate a map without walls at the goal's location", () => {
        const mapSettings = { ...settings, playerStartLocation: 0 };
        const map = getNextMap(mapSettings);

        const wallLocations = map.mapItems
            .get("wall")!
            .map((wall) => wall.location);
        const goal = map.mapItems.get("goal")![0];
        expect(wallLocations.includes(goal.location)).toBe(false);
    });

    test("should generate a map without the goal at the player's location", () => {
        const mapSettings = { ...settings, playerStartLocation: 0 };
        const map = getNextMap(mapSettings);

        const goal = map.mapItems.get("goal")![0];
        const player = map.mapItems.get("player")![0];
        expect(goal.location).not.toBe(player.location);
    });

    test("should generate a map with default number of walls", () => {
        const map = getNextMap(settings);
        expect(map.mapItems.get("wall")!.length).toBe(30);
    });

    test("should generate a map with the specified number of walls", () => {
        const mapSettings = { ...settings, wallCount: 5 };
        const map = getNextMap(mapSettings);
        expect(map.mapItems.get("wall")!.length).toBe(5);
    });
});
