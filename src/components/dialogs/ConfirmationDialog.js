import { PropTypesCommonDialog } from './utils';
import CommonDialog from './CommonDialog';

/**
 * Shows generic "Confirmation" dialog
 */
const ConfirmDialog = ({ title = 'Confirm?', confirmButtonText = 'Confirm', hideCancelButton = false, ...props }) => {
  return <CommonDialog title={title} confirmButtonText={confirmButtonText} hideCancelButton={hideCancelButton} {...props} />;
};

ConfirmDialog.propTypes = PropTypesCommonDialog;

export default ConfirmDialog;
