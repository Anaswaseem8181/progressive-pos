import { useState, useEffect, useCallback } from "react";
import { notify } from "../utils/notifications";
import staffService from "../api/staffService";

export const useStaff = (currentUser) => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const loadStaff = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      try {
        const response = await staffService.getStaff();
        setStaffList(response.data);
      } catch (error) {
        notify.error(error.response?.data?.message || "Failed to load staff");
      } finally {
        setLoading(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (email) => {
    setStaffToDelete(email);
    setShowDeleteModal(true);
  };

  const confirmDeleteStaff = async () => {
    if (staffToDelete) {
      try {
        await staffService.deleteStaff(staffToDelete);
        setShowDeleteModal(false);
        setStaffToDelete(null);
        loadStaff();
        notify.success("Staff member deleted successfully");
      } catch (error) {
        notify.error(error.response?.data?.message || "Failed to delete staff");
      }
    }
  };

  const toggleStaffStatus = async (staffId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await staffService.updateStaff(staffId, { status: newStatus });
      notify.success(`Staff member ${newStatus === "active" ? "activated" : "deactivated"}`);
      loadStaff();
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleSaveStaff = async (data) => {
    try {
      if (editingStaff) {
        await staffService.updateStaff(editingStaff._id, data);
        notify.success("Staff details updated");
      } else {
        await staffService.addStaff(data);
        notify.success("Staff member added successfully");
      }
      setIsModalOpen(false);
      loadStaff();
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to save staff member");
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const closeDeleteModal = () => setShowDeleteModal(false);

  return {
    staffList,
    loading,
    isModalOpen,
    editingStaff,
    showDeleteModal,
    staffToDelete,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    confirmDeleteStaff,
    toggleStaffStatus,
    handleSaveStaff,
    closeModal,
    closeDeleteModal
  };
};
