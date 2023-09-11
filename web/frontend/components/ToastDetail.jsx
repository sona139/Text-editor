import { Frame, Toast } from "@shopify/polaris";

const ToastDetail = ({ toast, handleChangeToast }) => {
	return (
		<div>
			<Frame>
				<Toast
					content={toast.message}
					onDismiss={() => {
						handleChangeToast({ isOpen: false, message: "" });
					}}
					duration={1000}
				/>
			</Frame>
		</div>
	);
};

export default ToastDetail;
