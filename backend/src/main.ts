import { Workspace } from "./model/Workspace.js";
import { config } from "./config/config.js";

async function main() {
    const workspace = new Workspace(config.workspacePath)
    await workspace.init()
}

main()