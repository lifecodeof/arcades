export interface Attribute {
    trait_type: string,
    value: string
}

export interface Metadata {
    name: string,
    image: string,
    description: string,
    external_url: string,
    attributes: Attribute[]
}

export interface Nft {
    id: number
    owner: string,
    meta: Metadata
}


export function randomAttributes(metadata: Omit<Metadata, "attributes">): Metadata {
    // both inclusive
    const max = 5
    const min = 1
    return {
        ...metadata, attributes: [
            {
                trait_type: "metal type",
                value: (Math.floor(Math.random() * (max - min + 1) + min)).toString()
            }
        ]
    }
}
