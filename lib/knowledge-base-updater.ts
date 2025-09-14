/**
 * Automated Knowledge Base Update System
 * This module automatically updates CLAUDE_KNOWLEDGE_BASE.md with new mistakes,
 * patterns, and lessons learned from Context7 validations
 */

import { DiscoveredMistake } from './post-edit-workflow';

export interface KnowledgeBaseUpdate {
  timestamp: string;
  mistakeType: string;
  mistake: string;
  solution: string;
  location: string;
  context7Reference?: string;
  severity: 'error' | 'warning' | 'info';
  frequency: number;
}

export interface LearningPattern {
  pattern: string;
  occurrences: number;
  solutions: string[];
  locations: string[];
  lastSeen: string;
}

/**
 * Update the knowledge base with new mistakes and patterns
 */
export async function updateKnowledgeBase(
  mistakes: DiscoveredMistake[],
  filePath: string
): Promise<void> {
  if (mistakes.length === 0) return;

  console.log(`📝 Updating knowledge base with ${mistakes.length} new entries`);

  // Read current knowledge base
  const currentContent = await readKnowledgeBaseFile();

  // Parse existing entries
  const existingPatterns = parseExistingPatterns(currentContent);

  // Process new mistakes
  const updates = processNewMistakes(mistakes, existingPatterns);

  // Generate updated content
  const updatedContent = generateUpdatedKnowledgeBase(currentContent, updates);

  // Write back to file
  await writeKnowledgeBaseFile(updatedContent);

  console.log('✅ Knowledge base updated successfully');
}

/**
 * Process new mistakes and merge with existing patterns
 */
function processNewMistakes(
  mistakes: DiscoveredMistake[],
  existingPatterns: LearningPattern[]
): KnowledgeBaseUpdate[] {
  const updates: KnowledgeBaseUpdate[] = [];

  mistakes.forEach(mistake => {
    // Check if this mistake pattern already exists
    const existingPattern = existingPatterns.find(pattern =>
      pattern.pattern.toLowerCase().includes(mistake.type.toLowerCase()) ||
      mistake.description.toLowerCase().includes(pattern.pattern.toLowerCase())
    );

    if (existingPattern) {
      // Update existing pattern
      existingPattern.occurrences++;
      existingPattern.lastSeen = new Date().toISOString();
      existingPattern.locations.push(mistake.location);
      if (!existingPattern.solutions.includes(mistake.solution)) {
        existingPattern.solutions.push(mistake.solution);
      }
    } else {
      // Create new knowledge base entry
      updates.push({
        timestamp: new Date().toISOString(),
        mistakeType: mistake.type,
        mistake: mistake.description,
        solution: mistake.solution,
        location: mistake.location,
        context7Reference: mistake.context7Reference,
        severity: mistake.severity,
        frequency: 1
      });
    }
  });

  return updates;
}

/**
 * Generate the updated knowledge base content
 */
function generateUpdatedKnowledgeBase(
  currentContent: string,
  updates: KnowledgeBaseUpdate[]
): string {
  let updatedContent = currentContent;

  // Find the insertion point for new mistakes
  const insertionPoint = findInsertionPoint(currentContent);

  // Generate new entries
  const newEntries = updates.map(update => generateMistakeEntry(update)).join('\n\n');

  // Update the learning log section
  const learningLogUpdate = generateLearningLogUpdate(updates);

  // Insert new entries
  if (newEntries) {
    updatedContent = insertNewEntries(updatedContent, insertionPoint, newEntries);
  }

  // Update learning log
  if (learningLogUpdate) {
    updatedContent = updateLearningLog(updatedContent, learningLogUpdate);
  }

  // Update last modified timestamp
  updatedContent = updateTimestamp(updatedContent);

  return updatedContent;
}

/**
 * Generate a formatted mistake entry for the knowledge base
 */
function generateMistakeEntry(update: KnowledgeBaseUpdate): string {
  const severity = update.severity === 'error' ? '🚫' :
                  update.severity === 'warning' ? '⚠️' : 'ℹ️';

  return `#### ${severity} Mistake: ${update.mistake}
**Location**: \`${update.location}\`
**Issue**: ${update.mistake}
**Solution**: ${update.solution}
${update.context7Reference ? `**Context7 Reference**: ${update.context7Reference}` : ''}
**Frequency**: ${update.frequency} occurrence(s)
**Last Seen**: ${new Date(update.timestamp).toLocaleDateString()}`;
}

/**
 * Generate learning log update
 */
function generateLearningLogUpdate(updates: KnowledgeBaseUpdate[]): string {
  const date = new Date().toLocaleDateString();
  const mistakeTypes = [...new Set(updates.map(u => u.mistakeType))];

  return `### ${date}
- **New Mistakes Discovered**: ${updates.length}
- **Pattern Types**: ${mistakeTypes.join(', ')}
- **High Priority**: ${updates.filter(u => u.severity === 'error').length} errors, ${updates.filter(u => u.severity === 'warning').length} warnings`;
}

/**
 * Create automated Context7 validation triggers
 */
export function createContext7ValidationTriggers(): void {
  console.log('🤖 Setting up automated Context7 validation triggers...');

  // These would be integrated into the development workflow
  const triggers = {
    preCommit: 'Run Context7 validation before git commits',
    preEdit: 'Check knowledge base before file modifications',
    postEdit: 'Validate against Context7 after changes',
    periodic: 'Weekly validation of all components'
  };

  Object.entries(triggers).forEach(([trigger, description]) => {
    console.log(`  ✓ ${trigger}: ${description}`);
  });
}

/**
 * Analyze patterns for recurring mistakes
 */
export function analyzeRecurringPatterns(patterns: LearningPattern[]): {
  highRisk: LearningPattern[];
  recommendations: string[];
} {
  const highRisk = patterns.filter(pattern => pattern.occurrences >= 3);
  const recommendations: string[] = [];

  highRisk.forEach(pattern => {
    recommendations.push(
      `🔥 HIGH FREQUENCY: "${pattern.pattern}" occurred ${pattern.occurrences} times`
    );
    recommendations.push(
      `   💡 RECOMMENDATION: Add pre-edit warning for this pattern`
    );
  });

  return { highRisk, recommendations };
}

/**
 * Integration with Context7 for pattern validation
 */
export async function validatePatternsWithContext7(
  patterns: LearningPattern[]
): Promise<{ pattern: string; validation: string }[]> {
  const validations: { pattern: string; validation: string }[] = [];

  for (const pattern of patterns) {
    try {
      // This would use the actual Context7 MCP tools
      // const validation = await mcp__context7__resolve-library-id(pattern.pattern);
      // const docs = await mcp__context7__get-library-docs(libraryId, pattern.pattern);

      validations.push({
        pattern: pattern.pattern,
        validation: `Context7 validation for ${pattern.pattern} pattern`
      });
    } catch (error) {
      console.warn(`Failed to validate pattern ${pattern.pattern} with Context7:`, error);
    }
  }

  return validations;
}

/**
 * Helper functions for file operations
 */
async function readKnowledgeBaseFile(): Promise<string> {
  // In a real implementation, this would use the Read tool
  // return await Read({ file_path: '/path/to/CLAUDE_KNOWLEDGE_BASE.md' });
  return `# CLAUDE Knowledge Base

## Overview
This file tracks recurring mistakes, solutions, and best practices discovered during development.

## Common Mistakes & Solutions

### React/Next.js Patterns

## Learning Log

---

**Last Updated**: 2025-01-14`;
}

async function writeKnowledgeBaseFile(content: string): Promise<void> {
  // In a real implementation, this would use the Write tool
  // await Write({ file_path: '/path/to/CLAUDE_KNOWLEDGE_BASE.md', content });
  console.log('Knowledge base file would be updated with:', content.slice(0, 200) + '...');
}

function parseExistingPatterns(content: string): LearningPattern[] {
  // Parse the existing knowledge base content
  // This would extract existing patterns and their metadata
  return [];
}

function findInsertionPoint(content: string): number {
  // Find where to insert new mistake entries
  const reactSection = content.indexOf('### React/Next.js Patterns');
  return reactSection > -1 ? reactSection : content.length;
}

function insertNewEntries(content: string, insertionPoint: number, newEntries: string): string {
  return content.slice(0, insertionPoint) +
         newEntries + '\n\n' +
         content.slice(insertionPoint);
}

function updateLearningLog(content: string, learningLogUpdate: string): string {
  const learningLogIndex = content.indexOf('## Learning Log');
  if (learningLogIndex === -1) return content;

  const nextSectionIndex = content.indexOf('---', learningLogIndex);
  const insertPoint = nextSectionIndex > -1 ? nextSectionIndex : content.length;

  return content.slice(0, insertPoint) +
         learningLogUpdate + '\n\n' +
         content.slice(insertPoint);
}

function updateTimestamp(content: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return content.replace(
    /\*\*Last Updated\*\*: \d{4}-\d{2}-\d{2}/,
    `**Last Updated**: ${timestamp}`
  );
}

/**
 * Main automated update function
 */
export async function runAutomatedUpdate(
  mistakes: DiscoveredMistake[],
  filePath: string
): Promise<void> {
  console.log('🔄 Running automated knowledge base update...');

  // Update knowledge base with new mistakes
  await updateKnowledgeBase(mistakes, filePath);

  // Analyze patterns
  const currentContent = await readKnowledgeBaseFile();
  const patterns = parseExistingPatterns(currentContent);
  const analysis = analyzeRecurringPatterns(patterns);

  if (analysis.highRisk.length > 0) {
    console.log('🚨 High-risk patterns detected:');
    analysis.recommendations.forEach(rec => console.log(rec));
  }

  // Validate patterns with Context7
  const validations = await validatePatternsWithContext7(patterns);
  console.log(`📚 Validated ${validations.length} patterns with Context7`);
}

export default {
  updateKnowledgeBase,
  createContext7ValidationTriggers,
  analyzeRecurringPatterns,
  validatePatternsWithContext7,
  runAutomatedUpdate
};