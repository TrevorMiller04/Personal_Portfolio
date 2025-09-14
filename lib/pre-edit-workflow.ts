/**
 * Pre-Edit Validation Workflow
 * This module implements the workflow to check the knowledge base and validate
 * against Context7 before making any code changes
 */

import { validateFile, ValidationResult, logMistakeToKnowledgeBase } from './claude-validation';

export interface PreEditCheck {
  knowledgeBaseReview: KnowledgeBaseEntry[];
  context7Validation: ValidationResult[];
  recommendations: string[];
  shouldProceed: boolean;
}

export interface KnowledgeBaseEntry {
  mistake: string;
  solution: string;
  location: string;
  context7Reference?: string;
  relevanceScore: number;
}

/**
 * Run pre-edit validation workflow
 */
export async function runPreEditValidation(
  targetFile: string,
  intendedChanges: string,
  changeType: 'create' | 'modify' | 'delete'
): Promise<PreEditCheck> {
  console.log(`🔍 Running pre-edit validation for: ${targetFile}`);

  // Step 1: Review knowledge base for relevant mistakes
  const knowledgeBaseReview = await reviewKnowledgeBase(targetFile, intendedChanges);

  // Step 2: Get current file content if it exists
  let currentContent = '';
  if (changeType !== 'create') {
    try {
      // This would read the file in a real implementation
      currentContent = await readFileContent(targetFile);
    } catch (error) {
      console.warn(`Could not read ${targetFile}:`, error);
    }
  }

  // Step 3: Run Context7 validation on intended changes
  const context7Validation = await validateFile(targetFile, intendedChanges);

  // Step 4: Generate recommendations
  const recommendations = generateRecommendations(
    knowledgeBaseReview,
    context7Validation,
    changeType
  );

  // Step 5: Determine if we should proceed
  const shouldProceed = evaluateSafeToProceed(knowledgeBaseReview, context7Validation);

  return {
    knowledgeBaseReview,
    context7Validation,
    recommendations,
    shouldProceed
  };
}

/**
 * Review knowledge base for relevant past mistakes
 */
async function reviewKnowledgeBase(
  targetFile: string,
  intendedChanges: string
): Promise<KnowledgeBaseEntry[]> {
  // In a real implementation, this would parse CLAUDE_KNOWLEDGE_BASE.md
  const knowledgeBaseContent = await readKnowledgeBase();
  const relevantEntries: KnowledgeBaseEntry[] = [];

  // Extract file type and component name
  const fileType = getFileType(targetFile);
  const componentName = extractComponentName(targetFile);

  // Check for relevant patterns based on file type
  if (fileType === 'react-component') {
    relevantEntries.push({
      mistake: 'Hardcoding content in components',
      solution: 'Import from data files and map over arrays',
      location: 'Components should use data/projects.json',
      context7Reference: 'Next.js data fetching patterns',
      relevanceScore: calculateRelevance(intendedChanges, ['hardcoded', 'content', 'array'])
    });

    relevantEntries.push({
      mistake: 'Missing TypeScript strict mode',
      solution: 'Convert to TypeScript with proper interfaces',
      context7Reference: 'TypeScript best practices for React',
      relevanceScore: calculateRelevance(targetFile, ['.js', '.jsx'])
    });
  }

  if (fileType === 'styling' || intendedChanges.includes('className')) {
    relevantEntries.push({
      mistake: 'Not following Syracuse branding',
      solution: 'Use Syracuse orange (#C13F03) and blue (#051C3D)',
      location: 'Design Philosophy section in CLAUDE.md',
      relevanceScore: calculateRelevance(intendedChanges, ['color', 'bg-', 'text-'])
    });
  }

  if (targetFile.includes('api/') || intendedChanges.includes('API')) {
    relevantEntries.push({
      mistake: 'Missing input validation',
      solution: 'Implement Zod schemas for all inputs',
      context7Reference: 'Zod validation patterns',
      relevanceScore: calculateRelevance(intendedChanges, ['request', 'body', 'params'])
    });
  }

  // Filter out low relevance entries
  return relevantEntries.filter(entry => entry.relevanceScore > 0.3);
}

/**
 * Generate actionable recommendations based on validation results
 */
function generateRecommendations(
  knowledgeBaseReview: KnowledgeBaseEntry[],
  context7Validation: ValidationResult[],
  changeType: 'create' | 'modify' | 'delete'
): string[] {
  const recommendations: string[] = [];

  // Add knowledge base recommendations
  knowledgeBaseReview.forEach(entry => {
    if (entry.relevanceScore > 0.7) {
      recommendations.push(`⚠️  PAST MISTAKE: ${entry.mistake}`);
      recommendations.push(`✅ SOLUTION: ${entry.solution}`);
      if (entry.context7Reference) {
        recommendations.push(`📚 REFERENCE: ${entry.context7Reference}`);
      }
    }
  });

  // Add Context7 validation recommendations
  context7Validation.forEach(validation => {
    validation.suggestions.forEach(suggestion => {
      const emoji = validation.severity === 'error' ? '🚫' :
                   validation.severity === 'warning' ? '⚠️' : 'ℹ️';
      recommendations.push(`${emoji} ${suggestion}`);
    });
  });

  // Add change-type specific recommendations
  if (changeType === 'create') {
    recommendations.push('📋 Check CLAUDE.md for architecture requirements');
    recommendations.push('🎨 Ensure Syracuse branding compliance');
  }

  return recommendations;
}

/**
 * Determine if it's safe to proceed with changes
 */
function evaluateSafeToProceed(
  knowledgeBaseReview: KnowledgeBaseEntry[],
  context7Validation: ValidationResult[]
): boolean {
  // Check for high-relevance past mistakes
  const highRiskMistakes = knowledgeBaseReview.filter(entry => entry.relevanceScore > 0.8);
  if (highRiskMistakes.length > 0) {
    console.warn('🚨 High-risk mistake pattern detected');
    return false;
  }

  // Check for Context7 errors
  const hasErrors = context7Validation.some(result => result.severity === 'error');
  if (hasErrors) {
    console.warn('🚨 Context7 validation errors detected');
    return false;
  }

  return true;
}

/**
 * Helper functions
 */
function getFileType(filePath: string): string {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    return 'react-component';
  }
  if (filePath.includes('api/')) {
    return 'api-route';
  }
  if (filePath.includes('prisma/')) {
    return 'database-schema';
  }
  if (filePath.includes('.css') || filePath.includes('tailwind')) {
    return 'styling';
  }
  return 'general';
}

function extractComponentName(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace(/\.(tsx|jsx|ts|js)$/, '');
}

function calculateRelevance(content: string, keywords: string[]): number {
  const matches = keywords.filter(keyword =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );
  return matches.length / keywords.length;
}

async function readFileContent(filePath: string): Promise<string> {
  // In a real implementation, this would use the Read tool
  return '';
}

async function readKnowledgeBase(): Promise<string> {
  // In a real implementation, this would read CLAUDE_KNOWLEDGE_BASE.md
  return '';
}

/**
 * Main entry point for pre-edit workflow
 */
export async function beforeEdit(
  targetFile: string,
  intendedChanges: string,
  changeType: 'create' | 'modify' | 'delete' = 'modify'
): Promise<boolean> {
  const validation = await runPreEditValidation(targetFile, intendedChanges, changeType);

  console.log('🔍 Pre-Edit Validation Results:');
  console.log('📚 Knowledge Base Entries:', validation.knowledgeBaseReview.length);
  console.log('🛡️ Context7 Validations:', validation.context7Validation.length);
  console.log('💡 Recommendations:', validation.recommendations.length);

  if (!validation.shouldProceed) {
    console.log('🛑 Pre-edit validation failed. Review recommendations before proceeding.');
    validation.recommendations.forEach(rec => console.log(rec));
    return false;
  }

  if (validation.recommendations.length > 0) {
    console.log('💡 Recommendations to consider:');
    validation.recommendations.forEach(rec => console.log(rec));
  }

  return true;
}

export default {
  runPreEditValidation,
  beforeEdit
};