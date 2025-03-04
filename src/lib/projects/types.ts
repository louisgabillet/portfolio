import type { Type } from "$lib/filesystem"

export type Details = {
    name: string,
    technologies: string[],
    date: string,
    client: string,
    requests: string[],
    target_audience: string[],
}
export type Descriptions = {
    intro: string,
    process: string,
    outcome: string,
    challenges: string,
}

export type Links = {
    live_demo: string,
    source_code: string,
}

type Gallery = {
    img_id: string,
    unique_name: string
    name: string,
    type: Type,
    src: string,
    pc?: boolean,
    mobile?: boolean,
}
export type Images = {
    logo: string,
    full_page: {
        pc: string,
        mobile: string,
    },
    gallery: Gallery[],
}

type Info = {
    details: Details,
    descriptions: Descriptions,
}
type Assets = {
    links: Links,
}
type Media = {
    images: Images,
}

export type Data = {
    info: Info,
    assets: Assets,
    media: Media,

}
