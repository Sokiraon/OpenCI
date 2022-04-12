interface RemoveOptions {
    force?: boolean;
}
export default function remove(projectNames: string[], options: RemoveOptions): Promise<void>;
export {};
