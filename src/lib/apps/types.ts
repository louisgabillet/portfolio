import type { SvelteComponent } from "svelte"

export type DeviceApps = {
    pc: App[],
    mobile: App[],
}
export interface App extends Partial<Finder>, Partial<Safari>, Partial<PDF> {
    name: string,
    type: string,
    src: string,
    shortcut?: boolean,
    desactivated?: boolean,
}
type Finder = {
    path: string[],
}
type Safari = {
    url: string,
    pages: {
        pc: SafariVersion,
        mobile: SafariVersion,
    },
}
type SafariVersion = {
        type: string,
        page: Record<'src', string> | { component: typeof SvelteComponent, props: any[] },
}
type PDF = {
    title: string,
    subtitle: string,
    client: {
        name: string,
        link: string,
    },
    year: string,
    site_type: string,
    requests: string[],
    tools_used: string[],
    target_audience: string[],
    img: Record<string, string>,
    color_code: string[],
    fonts: string[],
    desc: string,
}
