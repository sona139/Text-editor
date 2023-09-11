import { Modal, Text } from "@shopify/polaris";

const ModalConfirm = ({ confirmModal, handleChangeConfirmModal }) => {
	return (
		<div style={{ height: 500 }}>
			<Modal
				open={confirmModal.isOpen}
				onClose={() => handleChangeConfirmModal({ isOpen: false })}
				title={confirmModal.title}
				primaryAction={{
					content: confirmModal.contentAction,
					onAction: () => {
						handleChangeConfirmModal({ isOpen: false });
						confirmModal.onConfirm();
					},
					destructive: true,
					loading: confirmModal.loading,
				}}
				secondaryActions={[
					{
						content: "Cancle",
						onAction: () => {
							handleChangeConfirmModal({ isOpen: false });
						},
					},
				]}
			>
				<Modal.Section>
					<Text>{confirmModal.subTitle}</Text>
				</Modal.Section>
			</Modal>
		</div>
	);
};

export default ModalConfirm;
