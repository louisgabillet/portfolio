import type { Type } from "$lib/filesystem"

export type Details = {
    name: string,
    technologies: string[],
    date: string,
    client: string,
    requests: string[],
    targetAudience: string[],
}
export type Descriptions = {
    intro: string,
    process: string,
    outcome: string,
    challenges: string,
}
export type Design = {
    colorCode: string[],
    fonts: string[],
}
export type Links = {
    live_demo: string,
    source_code: string,
}
export type Gallery = {
    img_id: string,
    //unique_name: string
    name: string,
    type: Type,
    src: string,
    pc?: boolean,
    mobile?: boolean,
}
export type Images = {
    logo: string,
    fullPage: {
        pc: string,
        mobile: string,
    },
    gallery: Gallery[],
}
export type Data = {
    details: Details,
    design: Design,
    descriptions: Descriptions,
    links: Links,
    images: Images,
}
