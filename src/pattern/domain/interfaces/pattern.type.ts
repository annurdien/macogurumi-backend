type CrochetPattern = {
    parts: Part[];
}

type Stitch = {
    name: string;
    times: number;
}

type Sequence = {
    stiches: Stitch[];
    repeat: number;
}

type Layer = {
    id: number;
    sequences: Sequence[];
}

type Part = {
    name: string;
    layers: Layer[];
}

type Pattern = {
    parts: Part[];
}

export { CrochetPattern, Stitch, Sequence, Layer, Part, Pattern }