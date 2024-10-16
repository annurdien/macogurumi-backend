import { Layer, Part, Pattern, Sequence, Stitch } from '~pattern/domain/interfaces/pattern.type';

export interface MarkupToJSONConverter {
  /**
   * Converts a markup string into a Pattern object.
   * @param input - The input string in markup format.
   * @returns The parsed Pattern object.
   */
  convert(input: string): Pattern;
}

/**
 * Class to convert a Crochet Obvious Minimal Language (CROML) into a JSON object.
 * Implements the MarkupToJSONConverter interface.
 */
export class CROMLToJSONConverter implements MarkupToJSONConverter {

  /**
   * Parses a sequence of stitches from a string.
   * Groups of stitches followed by repeat counts are handled by regex.
   * 
   * @param sequenceText - The input string representing a sequence of stitches.
   * @returns An array of Sequence objects parsed from the input string.
   */
  private parseSequence(sequenceText: string): Sequence[] {
    const sequences: Sequence[] = [];

    // Match groups of stitches followed by repeat count in the format (stitches)[r=N]
    const groupRegex = /\((.*?)\)\s*\[r=(\d+)\]/g;
    let groupMatch;
    let lastIndex = 0;

    // Loop through each match of grouped stitches
    while ((groupMatch = groupRegex.exec(sequenceText)) !== null) {
      const groupContent = groupMatch[1];  // Group of stitches inside parentheses
      const repeats = parseInt(groupMatch[2], 10);  // Number of repeats after [r=]

      // Extract and handle any single stitches before the group
      const preGroupText = sequenceText.substring(lastIndex, groupMatch.index).trim();
      if (preGroupText) {
        this.addSingleStitches(sequences, preGroupText);
      }

      // Parse and add the group of stitches
      const stitches = this.parseStitchGroup(groupContent);
      sequences.push({
        stiches: stitches,
        repeats,
      });

      // Update lastIndex to the end of the current group match
      lastIndex = groupMatch.index + groupMatch[0].length;
    }

    // Handle any single stitches that occur after the last group
    const remainingText = sequenceText.substring(lastIndex).trim();
    if (remainingText) {
      this.addSingleStitches(sequences, remainingText);
    }

    return sequences;
  }

  /**
   * Parses and adds individual stitches (not grouped) from the input string.
   * Each stitch may optionally have a repeat count.
   * 
   * @param sequences - The array where parsed Sequence objects are stored.
   * @param text - The input string representing individual stitches.
   */
  private addSingleStitches(sequences: Sequence[], text: string): void {
    // Regex to match individual stitches with optional repeat count in the format STITCHxN
    const singleRegex = /([A-Z]+)(x(\d+))?/g;
    let match;

    // Loop through each match of single stitches
    while ((match = singleRegex.exec(text)) !== null) {
      const stitchName = match[1];  // Stitch name (e.g., K, P)
      const times = match[3] ? parseInt(match[3], 10) : 1;  // Repeat count (default to 1 if not specified)

      // Add the single stitch as a Sequence object
      sequences.push({
        stiches: [
          {
            name: stitchName,
            times: times,
          },
        ],
        repeats: 1,  // Single stitches repeat only once
      });
    }
  }

  /**
   * Parses a group of stitches from within parentheses.
   * 
   * @param groupContent - The string representing a group of stitches.
   * @returns An array of Stitch objects parsed from the group.
   */
  private parseStitchGroup(groupContent: string): Stitch[] {
    const stitches: Stitch[] = [];
    const singleRegex = /([A-Z]+)(x(\d+))?/g;  // Regex for single stitches within the group
    let match;

    // Loop through each match of single stitches inside the group
    while ((match = singleRegex.exec(groupContent)) !== null) {
      const stitchName = match[1];
      const times = match[3] ? parseInt(match[3], 10) : 1;

      // Add each stitch with its repeat count
      stitches.push({
        name: stitchName,
        times: times,
      });
    }

    return stitches;
  }

  /**
   * Parses a line of the markup, including handling row ranges and stitch sequences.
   * 
   * @param line - The input line from the markup representing one or more rows.
   * @param rowRange - The range of rows represented by the current line.
   * @returns An array of Layer objects, one for each row in the range.
   */
  private parseLine(line: string, rowRange: number[]): Layer[] {
    // Remove row numbers from the start of the line (e.g., "1-3: ")
    const sequenceText = line.replace(/^\d+(-\d+)?:\s*/, '');
    const sequences = this.parseSequence(sequenceText);  // Parse the sequence of stitches

    // Create a Layer object for each row in the range
    const layers: Layer[] = rowRange.map((row) => ({
      id: row,  // Row number
      sequences: sequences,  // Parsed sequence for this row
    }));

    return layers;
  }

  /**
   * Parses a row range from the markup (e.g., "1-3" or "5").
   * 
   * @param range - The string representing a row range.
   * @returns An array of numbers representing the rows in the range.
   */
  private parseRowRange(range: string): number[] {
    const rangeMatch = range.match(/(\d+)-(\d+)/);  // Match a range like "1-3"
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      // Generate an array of numbers from start to end
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    // If no range, return the single row number
    return [parseInt(range, 10)];
  }

  /**
   * Converts the markup string into a JSON object representing the Pattern.
   * Each part and its corresponding rows and stitches are parsed and returned.
   * 
   * @param input - The input string in markup format.
   * @returns The parsed Pattern object.
   */
  public convert(input: string): Pattern {
    const parts: Part[] = [];
    let currentPart: Part | null = null;

    // Remove all spaces but preserve newlines in the input string
    const noSpacing = input.replaceAll(' ', '');

    const lines = input.split(/\r?\n/);  // Split input into lines

    lines.forEach((line: string) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;  // Skip empty lines

      // Match new part headers (e.g., "Body:", "Head:, "Head Bang:", "Head-Body:")
      const partMatch = trimmedLine.match(/^\s*([\w\s\d\-\/]+):\s*$/);
      if (partMatch) {
        // Start a new part
        const partName = partMatch[1];
        currentPart = {
          name: partName,
          layers: [],
        };
        parts.push(currentPart);  // Add the part to the parts array
        return;
      }

      if (!currentPart) return;  // Ignore lines that are not part of a section

      // Match rows and row ranges (e.g., "1-3: SCx13", "5: SCx10")
      const rowMatch = trimmedLine.match(/^(\d+(-\d+)?):\s*(.*)/);
      if (rowMatch) {
        const rowRange = this.parseRowRange(rowMatch[1]);  // Parse the row range
        const layerText = rowMatch[3];  // Get the stitches after the row numbers

        const layers = this.parseLine(layerText, rowRange);  // Parse the row's sequences
        currentPart.layers.push(...layers);  // Add the parsed layers to the current part
      }
    });

    return { parts };  // Return the final Pattern object with all parts and layers
  }
}