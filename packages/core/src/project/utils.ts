import child_process from "child_process";

export function listRemoteGitUrl(url: string) {
  try {
    const output = child_process.execSync(`git ls-remote -ht ${url}`, {
      encoding: "utf-8",
    });
    const branches: string[] = [];
    const tags: string[] = [];

    const records = output.split("\n");
    const branchExp = new RegExp(/.*refs\/heads\/(.*)/);
    const tagExp = new RegExp(/.*refs\/tags\/(.*)/);
    for (const record of records) {
      const branchMatch = branchExp.exec(record);
      if (branchMatch) {
        branches.push(branchMatch[1]);
      } else {
        const tagMatch = tagExp.exec(record);
        if (tagMatch) {
          tags.push(tagMatch[1]);
        }
      }
    }
    return {
      branches,
      tags,
    };
  } catch {
    return undefined;
  }
}
