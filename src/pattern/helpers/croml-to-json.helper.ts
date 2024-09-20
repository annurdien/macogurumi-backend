import { Layer, Part, Pattern, Sequence, Stitch } from "~pattern/domain/interfaces/pattern.type";

export interface MarkupToJSONConverter {
    convert(input: string): Pattern;
}

export class CROMLToJSONConverter implements MarkupToJSONConverter {
    private parseSequence(sequenceText: string): Sequence[] {
        const sequences: Sequence[] = [];

        // Regular expression to match grouped sequences with repeats
        const groupRegex = /\((.*?)\)\s*\[r=(\d+)\]/g;
        let groupMatch;
        let lastIndex = 0;

        // Process each grouped sequence
        while ((groupMatch = groupRegex.exec(sequenceText)) !== null) {
            const groupContent = groupMatch[1];
            const repeat = parseInt(groupMatch[2], 10);

            // Handle single stitches before the group
            const preGroupText = sequenceText.substring(lastIndex, groupMatch.index).trim();
            if (preGroupText) {
                this.addSingleStitches(sequences, preGroupText);
            }

            // Add the group sequence
            const stitches = this.parseStitchGroup(groupContent);
            sequences.push({
                stiches: stitches,
                repeat,
            });

            // Update lastIndex to be the end of the current group
            lastIndex = groupMatch.index + groupMatch[0].length;
        }

        // Handle any single stitches after the last group
        const remainingText = sequenceText.substring(lastIndex).trim();
        if (remainingText) {
            this.addSingleStitches(sequences, remainingText);
        }

        return sequences;
    }

    // Add single stitches to sequences
    private addSingleStitches(sequences: Sequence[], text: string): void {
        const singleRegex = /([A-Z]+)(x(\d+))?/g;
        let match;

        while ((match = singleRegex.exec(text)) !== null) {
            const stitchName = match[1];
            const times = match[3] ? parseInt(match[3], 10) : 1;

            sequences.push({
                stiches: [
                    {
                        name: stitchName,
                        times: times,
                    },
                ],
                repeat: 1,
            });
        }
    }

    // Parse a group of stitches
    private parseStitchGroup(groupContent: string): Stitch[] {
        const stitches: Stitch[] = [];
        const singleRegex = /([A-Z]+)(x(\d+))?/g;
        let match;

        while ((match = singleRegex.exec(groupContent)) !== null) {
            const stitchName = match[1];
            const times = match[3] ? parseInt(match[3], 10) : 1;

            stitches.push({
                name: stitchName,
                times: times,
            });
        }

        return stitches;
    }



    private parseLine(line: string, rowRange: number[]): Layer[] {
        const sequenceText = line.replace(/^\d+(-\d+)?:\s*/, ''); // Remove row numbers
        const sequences = this.parseSequence(sequenceText);

        const layers: Layer[] = rowRange.map((row) => ({
            id: row,
            sequences: sequences, // Correctly map all parsed sequences
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
        
        // remove all spaces but not newline in input string
        const noSpacing = input.replaceAll(' ', '');

        console.log(noSpacing)

        const lines = noSpacing.split(/\r?\n/);

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

