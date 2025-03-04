import { type FileSystem } from "$lib/filesystem";
import { toast } from "$lib/toast";
import type { Data } from "./types";

export async function loadProjects(): Promise<FileSystem[]> {
    const modules = import.meta.glob('./*/**/index.ts');

    const projectPromises = Object.keys(modules).map(async (path) => {
        const mod: any = await modules[path]();
        const projectName = path.split('/')[1];
        const data = mod.app;

        return {
            name: projectName,
            ...data,
        };
    });

    const resolvedProjects: FileSystem[] = await Promise.all(projectPromises);
    return resolvedProjects;
}

export async function loadProjectData(n: string):Promise<Data | undefined> {
    try {
        const mod = await import(`../../lib/projects/${n}/index.ts`);

        if (mod?.data) {
            return mod.data;
        } else {
            throw Error("Module does dot export data");
        }
    } catch (err) {
        console.error(err);
        toast.missing({
            appName: 'Preview',
            title: 'Contenu introuvable',
            message: `Nous n'avons pas pu trouver le contenu ouvert. Veuillez réessayer.`,
        })
    }
}
