import { toast } from "$lib/toast";
import { type FileSystem } from "$lib/filesystem";
import type { Data } from "./types";

type Project = {
    app: FileSystem,
    data: Data,
}

export async function loadProjects(): Promise<Project[]> {
    const modules: Record<string, () => Promise<unknown>> = import.meta.glob('./*/**/index.ts');

    const promises = Object.entries(modules).map(async ([path, loadModule]) => {
        try {
            const { app, data }= await loadModule() as Project;

            return { app, data };

        } catch (err) {
            const splitName = path.split('/'); 
            const projectName = splitName[splitName.length - 2];

            console.error(`Failed to load module at path: ${path}`, err);
            setTimeout(() => {
                toast.error({
                    appName: 'Finder',
                    title: `Chargement de '${projectName}'`,
                    message: `Une erreur est survenue lors du chargement du projet: '${projectName}'. Veuillez réessayer.`,
                })
            })
            return null;
        }
    });

    return (await Promise.all(promises)).filter((p): p is Project => p !== null);
}

export async function loadProjectData(n: string):Promise<Data | undefined> {
    try {
        const mod = await import(`../../lib/projects/${n}/index.ts`);

        if (!mod?.data) {
            throw Error("Module does dot export data");
        }

        return mod.data;

    } catch (err) {
        console.error(err);
        toast.missing({
            appName: 'Preview',
            title: 'Contenu introuvable',
            message: `Nous n'avons pas pu trouver le contenu ouvert. Veuillez réessayer.`,
        })
    }
}
