import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import Color from '../themes/Color';

const LoadingModal = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <ActivityIndicator size="large" style={{ marginBottom: 20 }} color={Color.darkestGray} />
          <Text style={{ color: Color.darkestGray }}>Đang tải</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: Color.white,
    minWidth: 200,
    maxWidth: '80%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default LoadingModal;