import { Layer, Part, Pattern, Sequence, Stitch } from "~pattern/domain/interfaces/pattern.type";

export interface MarkupToJSONConverter {
    convert(input: string): Pattern;
}

export class CROMLToJSONConverter implements MarkupToJSONConverter {
    private parseStitchGroup(group: string): Stitch[] {
        const stitches: Stitch[] = [];
        const stitchRegex = /([A-Z]+)(x(\d+))?/g;

        let match;
        while ((match = stitchRegex.exec(group)) !== null) {
            const stitchName = match[1];
            const times = match[3] ? parseInt(match[3], 10) : 1;

            stitches.push({
                name: stitchName,
                times,
            });
        }

        return stitches;
    }

    private parseSequence(sequenceText: string): Sequence {
        const groupRegex = /\((.*?)\)\s*\[r=(\d+)\]/g;
        const singleRegex = /([A-Z]+)(x(\d+))?/g;

        const sequences: Sequence[] = [];

        let match;

        // Handle groups like (SCx1, INCx1) [r=6]
        while ((match = groupRegex.exec(sequenceText)) !== null) {
            const groupContent = match[1]; // SCx1, INCx1
            const repeat = parseInt(match[2], 10); // r=6

            const stitches = this.parseStitchGroup(groupContent);

            sequences.push({
                stiches: stitches,
                repeat,
            });
        }

        // Handle single stitches like SCx8, INCx1
        let singleMatch;
        while ((singleMatch = singleRegex.exec(sequenceText)) !== null) {
            const stitchName = singleMatch[1];
            const times = singleMatch[3] ? parseInt(singleMatch[3], 10) : 1;

            sequences.push({
                stiches: [
                    {
                        name: stitchName,
                        times: 1,
                    }
                ],
                repeat: times,
            });
        }

        return sequences.length > 0 ? sequences[0] : { stiches: [], repeat: 1 }; // Handle single sequences
    }

    private parseLine(line: string, rowRange: number[]): Layer[] {
        const sequences: Sequence[] = [];
        const stitchRegex = /([A-Z]+)(x(\d+))?/g;

        const sequenceText = line.replace(/^\d+(-\d+)?:\s*/, ''); // Remove row numbers
        const sequence = this.parseSequence(sequenceText);

        const layers: Layer[] = rowRange.map((row) => ({
            id: row,
            sequences: [sequence],
        }));

        return layers;
    }

    private parseRowRange(range: string): number[] {
        const rangeMatch = range.match(/(\d+)-(\d+)/);
        if (rangeMatch) {
            const start = parseInt(rangeMatch[1], 10);
            const end = parseInt(rangeMatch[2], 10);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }

        return [parseInt(range, 10)];
    }

    public convert(input: string): Pattern {
        const parts: Part[] = [];
        let currentPart: Part | null = null;

        const lines = input.split(/\r?\n/);

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return; // Skip empty lines

            const partMatch = trimmedLine.match(/^\s*(\w+):\s*$/);
            if (partMatch) {
                // Starting a new part (e.g., Body, Paws, Head)
                const partName = partMatch[1];
                currentPart = {
                    name: partName,
                    layers: [],
                };
                parts.push(currentPart);
                return;
            }

            if (!currentPart) return; // Ignore lines outside of parts

            const rowMatch = trimmedLine.match(/^(\d+(-\d+)?):\s*(.*)/);
            if (rowMatch) {
                const rowRange = this.parseRowRange(rowMatch[1]);
                const layerText = rowMatch[3];

                const layers = this.parseLine(layerText, rowRange);
                currentPart.layers.push(...layers);
            }
        });

        return { parts };
    }
}

// Example usage:
// const markup = `
//   Body:
//   1: SCx6
//   2: INCx6
//   3: (SCx1, INCx1) [r=6]
//   4: (SCx8, INCx1) [r=2]
//   5-10: SCx20
//   11: (SCx8, DECx1) [r=2]
//   12: (SCx1, DECx1) [r=6]
//   13: DECx6
//   Paws:
//   1: SCx6
//   2-6: SCx6
//   Head:
//   1: SCx6
//   2: (SCx1, INCx1) [r=6]
//   3: (SCx2, INCx1) [r=6]
//   4: (SCx3, INCx1) [r=6]
//   5: (SCx4, INCx1) [r=6]
//   6-8: SCx30
//   9: (SCx3, DECx1) [r=6]
//   10-11: SCx24
//   12: (SCx2, DECx1) [r=6]
//   13-14: SCx18
//   15: (SCx1, DECx1) [r=6]
//   16: DECx6
//   Ears:
//   1: CHx5, SCx1, DCx2, SCx1
//   Horn:
//   1: SCx4
//   2: SCx5
//   3: SCx6
//   4: SCx8
//   `
// const converter = new CROMLToJSONConverter();
// const jsonPattern = converter.convert(markup);
// console.log(JSON.stringify(jsonPattern, null, 2));
