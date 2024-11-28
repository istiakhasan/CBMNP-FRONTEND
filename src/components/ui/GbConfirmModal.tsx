// import { confirmAlert } from 'react-confirm-alert';
// import { message } from 'antd';

// const GBconfirmModal = async (deleteHandler:any, recordId:any) => {
//   confirmAlert({
//     // title: 'Confirm to delete',
//     // message: 'Are you sure you want to delete this item?',
//     // buttons: [
//     //   {
//     //     label: 'Yes',
//     //     onClick: async () => {
//     //       try {
//     //         const res = await deleteHandler({ id: recordId });
//     //         if (res) {
//     //           message.success("Category deleted successfully.");
//     //         }
//     //       } catch (error) {
//     //         message.error("Something went wrong");
//     //       }
//     //     }
//     //   },
//     //   {
//     //     label: 'No',
//     //     onClick: () => {
//     //       console.log('Deletion canceled');
//     //     }
//     //   }
//     // ]
//   });
// };

// export default GBconfirmModal
import { confirmAlert } from 'react-confirm-alert';
import { message } from 'antd';
import './component.style.css'; // Import your CSS file
import { toast } from 'react-toastify';

const GBconfirmModal = async (deleteHandler:any, recordId:any,cb:any) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="custom-alert-container text-center">
            <i className="ri-information-2-line text-[#E94241] text-[50px]"></i>
          <h1 className="custom-alert-title">Delete Item</h1>
          <p className="custom-alert-message">Are you sure you want to delete this item?</p>
          <p className="custom-alert-message">This action cannot be undone.</p>
          <div className='flex gap-3 items-center justify-center my-[30px]'>
            <button
              className="bg-[#E7E7E7] py-[5px] px-[20px] text-[12px] font-bold text-[#444343] rounded-sm"
              onClick={onClose}
            >
              No
            </button>
            <button
              className="bg-[#E94241] py-[5px] px-[20px] text-[12px] font-bold text-white rounded-sm "
              onClick={async () => {
                try {
                  const res = await deleteHandler({ id: recordId });
                  if (res) {
                   cb()
                  }
                } catch (error) {
                  toast.error("Something went wrong");
                }
                onClose();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      );
    }
  });
};
export default GBconfirmModal




