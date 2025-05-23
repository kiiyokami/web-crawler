import { sortPages } from "../functions/report";
import { test, expect, describe } from "vitest";

describe("sortPages", () =>{
    test("sort protocol", () => {
        const input = {
          url1: 5,
          url2: 1,
          url3: 3,
          url4: 10,
          url5: 7,
        };
        const actual = sortPages(input);
        const expected = [
          ["url4", 10],
          ["url5", 7],
          ["url1", 5],
          ["url3", 3],
          ["url2", 1],
        ];
        expect(actual).toEqual(expected);
      });
      
      test("sortPages null case", () => {
        const input = {};
        const actual = sortPages(input);
        const expected: (string | number)[][] = [];
        expect(actual).toEqual(expected);
      });
})