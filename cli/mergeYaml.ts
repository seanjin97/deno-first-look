import { parse } from "./deps.ts";
import dot from "dot-object";
import yaml from "js-yaml";

export const mergeYaml = (file1: object, file2: object) => {
  dot.keepArray = true;

  const formattedFile1: object = dot.dot(file1);
  const formattedFile2: object = dot.dot(file2);

  return { ...formattedFile1, ...formattedFile2 };
};

if (import.meta.main) {
  const flags = parse(Deno.args, {
    string: ["file1", "file2", "outputFile"],
  });

  const file1 = Deno.readTextFileSync(flags.file1!);
  const file2 = Deno.readTextFileSync(flags.file2!);

  const data1 = yaml.load(file1, null);
  const data2 = yaml.load(file2, null);

  const merged = mergeYaml(data1, data2);

  const formattedYaml = yaml.dump(dot.object(merged));

  Deno.writeTextFileSync(flags.outputFile!, formattedYaml);
}
