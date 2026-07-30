// GitHub publish helpers — commit files to the content repo via Octokit.
// Requires GITHUB_TOKEN (contents:write) and GITHUB_REPO (owner/repo) env vars.
import { Octokit } from "octokit";

let octokit: Octokit | null = null;

function getOctokit(): Octokit {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not set");
    octokit = new Octokit({ auth: token });
  }
  return octokit;
}

function parseRepo(): { owner: string; repo: string } {
  const raw = process.env.GITHUB_REPO;
  if (!raw) throw new Error("GITHUB_REPO is not set (expected owner/repo)");
  const [owner, repo] = raw.split("/");
  if (!owner || !repo) throw new Error(`GITHUB_REPO invalid: "${raw}"`);
  return { owner, repo };
}

const DEFAULT_BRANCH = "main";

/**
 * Create or update a single file on the default branch.
 * Performs a get-blob → create-blob → create-tree → create-commit → update-ref sequence
 * so we don't need working-tree access.
 */
export async function commitFile(args: {
  path: string;
  content: string;
  message: string;
  encoding?: "utf-8" | "base64";
}): Promise<{ sha: string; url: string }> {
  return commitFiles({
    files: [args],
    message: args.message,
  });
}

/**
 * Commit multiple files atomically on the default branch in one commit.
 */
export async function commitFiles(args: {
  files: { path: string; content: string; encoding?: "utf-8" | "base64" }[];
  message: string;
}): Promise<{ sha: string; url: string }> {
  const octo = getOctokit();
  const { owner, repo } = parseRepo();

  // Get the current HEAD ref
  const ref = await octo.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${DEFAULT_BRANCH}`,
  });
  const headSha = ref.data.object.sha;

  // Get current commit tree
  const baseCommit = await octo.rest.git.getCommit({
    owner,
    repo,
    commit_sha: headSha,
  });
  const baseTreeSha = baseCommit.data.tree.sha;

  // Create blobs for each file
  const treeEntries: { path: string; mode: "100644"; type: "blob"; sha: string }[] = [];
  for (const f of args.files) {
    const contentB64 =
      f.encoding === "base64"
        ? f.content
        : Buffer.from(f.content, "utf-8").toString("base64");
    const blob = await octo.rest.git.createBlob({
      owner,
      repo,
      content: contentB64,
      encoding: "base64",
    });
    treeEntries.push({
      path: f.path,
      mode: "100644",
      type: "blob",
      sha: blob.data.sha,
    });
  }

  // Create new tree pointing at the new blobs
  const newTree = await octo.rest.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: treeEntries,
  });

  // Create commit
  const newCommit = await octo.rest.git.createCommit({
    owner,
    repo,
    message: args.message,
    tree: newTree.data.sha,
    parents: [headSha],
  });

  // Update ref
  await octo.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${DEFAULT_BRANCH}`,
    sha: newCommit.data.sha,
  });

  return {
    sha: newCommit.data.sha,
    url: `https://github.com/${owner}/${repo}/commit/${newCommit.data.sha}`,
  };
}
