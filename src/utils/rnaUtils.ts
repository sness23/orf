// RNA codon to amino acid mapping
export const RNA_CODON_TABLE: Record<string, string> = {
  "GCA":"A", "GCC":"A", "GCG":"A", "GCU":"A",
  "UGC":"C", "UGU":"C", "GAC":"D", "GAU":"D",
  "GAA":"E", "GAG":"E", "UUC":"F", "UUU":"F",
  "GGA":"G", "GGC":"G", "GGG":"G", "GGU":"G",
  "CAC":"H", "CAU":"H", "AUA":"I", "AUC":"I",
  "AUU":"I", "AAA":"K", "AAG":"K", "UUA":"L",
  "UUG":"L", "CUA":"L", "CUC":"L", "CUG":"L",
  "CUU":"L", "AUG":"M", "AAC":"N", "AAU":"N",
  "CCA":"P", "CCC":"P", "CCG":"P", "CCU":"P",
  "CAA":"Q", "CAG":"Q", "AGA":"R", "AGG":"R",
  "CGA":"R", "CGC":"R", "CGU":"R", "CGG":"R",
  "AGC":"S", "AGU":"S", "UCA":"S", "UCC":"S",
  "UCG":"S", "UCU":"S", "ACA":"T", "ACC":"T",
  "ACG":"T", "ACU":"T", "GUA":"V", "GUC":"V",
  "GUG":"V", "GUU":"V", "UGG":"W", "UAC":"Y",
  "UAU":"Y", "UAG":"*", "UAA":"*", "UGA":"*"
};

/**
 * Translates an RNA sequence to a protein sequence
 * @param rnaSequence The RNA sequence to translate
 * @returns The translated protein sequence
 */
export function translateRNA(rnaSequence: string): string {
  // Make sure the sequence is uppercase
  const sequence = rnaSequence.toUpperCase();
  let protein = '';
  
  // Iterate through the sequence in groups of 3 (codons)
  for (let i = 0; i < sequence.length; i += 3) {
    // Check if we have a complete codon (3 nucleotides)
    if (i + 2 < sequence.length) {
      const codon = sequence.slice(i, i + 3);
      
      // Translate the codon to an amino acid using the codon table
      if (RNA_CODON_TABLE[codon]) {
        // Check if we hit a stop codon
        if (RNA_CODON_TABLE[codon] === '*') {
          break; // Stop translation at stop codon
        }
        protein += RNA_CODON_TABLE[codon];
      } else {
        // If the codon isn't in our table, add '?' as a placeholder
        protein += '?';
      }
    }
  }
  
  return protein;
}

/**
 * Finds all possible open reading frames (ORFs) in an RNA sequence
 * An ORF starts with AUG (start codon) and ends with a stop codon (UAG, UAA, UGA)
 * @param rnaSequence The RNA sequence to analyze
 * @returns Array of protein sequences from all possible ORFs
 */
export function findORFs(rnaSequence: string): string[] {
  const sequence = rnaSequence.toUpperCase();
  const orfs: string[] = [];
  
  // Look for start codons (AUG)
  for (let i = 0; i < sequence.length - 2; i++) {
    if (sequence.slice(i, i + 3) === 'AUG') {
      let orf = '';
      let hasStopCodon = false;
      
      // Translate from start codon until a stop codon or end of sequence
      for (let j = i; j < sequence.length - 2; j += 3) {
        const codon = sequence.slice(j, j + 3);
        
        if (RNA_CODON_TABLE[codon]) {
          if (RNA_CODON_TABLE[codon] === '*') {
            hasStopCodon = true;
            break; // Found a stop codon, ORF is complete
          }
          orf += RNA_CODON_TABLE[codon];
        } else {
          // Incomplete codon at the end or invalid codon
          break;
        }
      }
      
      // Only add ORFs with a proper stop codon
      if (orf && hasStopCodon) {
        orfs.push(orf);
      }
    }
  }
  
  return orfs;
}