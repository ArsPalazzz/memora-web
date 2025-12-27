export interface DeleteDeskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}
