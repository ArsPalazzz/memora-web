export interface CardExamplesModalProps {
  open: boolean;
  onClose: () => void;
  examples: string[];
  canRegenerate?: boolean;
  isRegenerating?: boolean;
  onRegenerate?: () => void;
}
