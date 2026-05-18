import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { useStaff } from "../../hooks/useStaff";
import StaffTable from "../../components/dashboard/staff/staffTable";
import StaffHeader from "../../components/dashboard/staff/staffHeader";
import { StaffModal } from "../../components/modals/staff/StaffModal";
import WarningModal from "../../components/modals/common/WarningModal";

const Staff = () => {
  const { user: currentUser } = useAuth();

  const {
    staffList,
    isModalOpen,
    editingStaff,
    showDeleteModal,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    confirmDeleteStaff,
    toggleStaffStatus,
    handleSaveStaff,
    closeModal,
    closeDeleteModal
  } = useStaff(currentUser);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <StaffHeader
        businessName={currentUser?.businessName}
        onAddStaff={handleAddStaff}
      />

      <StaffTable
        users={staffList}
        onEdit={handleEditStaff}
        onDelete={handleDeleteStaff}
        onToggleStatus={toggleStaffStatus}
      />

      <StaffModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveStaff}
        staff={editingStaff}
      />

      <WarningModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteStaff}
        title="Delete Staff Member?"
        message={`Are you sure you want to remove this staff member? This will permanently revoke their access to ${currentUser?.businessName}.`}
        confirmText="Delete Staff"
        variant="danger"
      />
    </motion.div>
  );
};

export default Staff;
