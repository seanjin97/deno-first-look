import yaml from "js-yaml";
import { mergeYaml } from "../mergeYaml.ts";
import dot from "dot-object";
import { beforeAll, describe, it } from "../deps.ts";
import { assert, assertStrictEquals } from "../deps.ts";

const filePath1 = "./__tests__/testAppLocalFixture.yaml";
const filePath2 = "./__tests__/testAppProdFixture.yaml";

// deno-lint-ignore no-explicit-any
let data1: any;
// deno-lint-ignore no-explicit-any
let data2: any;
// deno-lint-ignore no-explicit-any
let merged: any;

beforeAll(() => {
  const file1 = Deno.readTextFileSync(filePath1);
  const file2 = Deno.readTextFileSync(filePath2);

  data1 = yaml.load(file1, null);
  data2 = yaml.load(file2, null);

  const mergedDotYaml = mergeYaml(data1, data2);
  merged = dot.object(mergedDotYaml);
});

describe("merged yaml", () => {
  it("should correctly keep file1's key values if not present in file2", () => {
    assert(!("running" in data2.person.hobbies));

    assertStrictEquals(
      merged.person.hobbies.running.man,
      data1.person.hobbies.running.man,
    );
  });

  it("should correctly add file2's key values if not present in file1", () => {
    assert(!("i-must-appear" in data1.person));
    assertStrictEquals(
      merged.person["i-must-appear"],
      data2.person["i-must-appear"],
    );
  });

  it("should correctly override file1's key value if both file1 and file2 has the same key", () => {
    assert("url" in data1.person);
    assert("url" in data2.person);
    assertStrictEquals(merged.person.url, data2.person.url);
  });

  it("should correctly override lists if both file1 and file2 has the same key", () => {
    assert(("some-list") in data1);
    assert(("some-list") in data2);
    assertStrictEquals(merged["some-list"], data2["some-list"]);
  });

  it("should correctly override nested list of objects if both file1 and file2 has the same key", () => {
    assert("licences" in data1.person);
    assert("licences" in data2.person);
    assertStrictEquals(merged.person.licences, data2.person.licences);
  });
});
