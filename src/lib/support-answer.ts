import { z } from 'zod';
export const supportAnswerSchema = z.object({
  answer: z.string().min(1).max(4000),
  confidence: z.number().min(0).max(1),
  sourceIndexes: z.array(z.number().int().nonnegative()).max(5),
  handoff: z.boolean(),
});
export function canAnswer(result: z.infer<typeof supportAnswerSchema>, sourceCount: number) {
  return !result.handoff && result.confidence >= 0.85 && result.sourceIndexes.length > 0 && result.sourceIndexes.every(i => i < sourceCount);
}
