// Pure rendering policy: priority content cannot be re-hidden on hydration.
export function isMotionContentVisible({ firstPaint, armed, seen, reduced }: {
  firstPaint: boolean; armed: boolean; seen: boolean; reduced: boolean;
}): boolean {
  return firstPaint || !armed || seen || reduced;
}