import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomText from './CustomText';

interface DatePickerModalProps {
  value: Date;
  onChange: (date: Date) => void;
  visible: boolean;
  onClose: () => void;
  title?: string;
}

export const DatePickerModal = ({
  value,
  onChange,
  visible,
  onClose,
  title = 'Select Date',
}: DatePickerModalProps) => {
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      onClose();
    }
    if (date) {
      setSelectedDate(date);
      if (Platform.OS === 'ios') {
        // On iOS, we keep the modal open until user confirms
      } else {
        onChange(date);
      }
    }
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    setSelectedDate(value); // Reset to original value
    onClose();
  };

  if (Platform.OS === 'ios') {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={handleCancel}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <CustomText variant="secondary">Cancel</CustomText>
              </TouchableOpacity>
              <CustomText variant="sectionTitle">{title}</CustomText>
              <TouchableOpacity onPress={handleConfirm}>
                <CustomText variant="bodyMedium" style={styles.confirmButton}>
                  Done
                </CustomText>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              style={styles.datePicker}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // Android
  return (
    <>
      {visible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  confirmButton: {
    color: '#6366f1',
    fontWeight: '600',
  },
  datePicker: {
    width: '100%',
  },
});
